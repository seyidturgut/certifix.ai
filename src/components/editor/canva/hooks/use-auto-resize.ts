import { useCallback, useEffect } from "react";
import { fabric } from "fabric";

interface UseAutoResizeProps {
    canvas: fabric.Canvas | null;
    container: HTMLDivElement | null;
}

export const useAutoResize = ({
    canvas,
    container,
}: UseAutoResizeProps) => {
    const autoResize = useCallback(() => {
        if (!canvas || !container) return;

        const width = container.offsetWidth;
        const height = container.offsetHeight;

        canvas.setWidth(width);
        canvas.setHeight(height);

        const center = canvas.getCenter();

        const zoomRatio = 0.85;
        const localWorkspace = canvas.getObjects().find((obj) => obj.name === "clip");

        if (!localWorkspace) return;

        // @ts-ignore
        const scale = fabric.util.findScaleToFit(localWorkspace, {
            width: width,
            height: height,
        });

        const zoom = zoomRatio * scale;

        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

        if (!localWorkspace) return;

        const workspaceCenter = localWorkspace.getCenterPoint();
        const viewportTransform = canvas.viewportTransform;

        if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;

        viewportTransform[4] = canvas.width / 2 - workspaceCenter.x * viewportTransform[0];
        viewportTransform[5] = canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

        canvas.setViewportTransform(viewportTransform);
        canvas.renderAll();
    }, [canvas, container]);

    useEffect(() => {
        let resizeObserver: ResizeObserver | null = null;

        if (canvas && container) {
            resizeObserver = new ResizeObserver(() => {
                autoResize();
            });

            resizeObserver.observe(container);
        }

        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [canvas, container, autoResize]);

    return { autoResize };
};
