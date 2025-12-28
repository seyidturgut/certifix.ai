import { useCallback, useState, useMemo } from "react";
import { fabric } from "fabric";
import { useCanvasEvents } from "./use-canvas-events";
import {
    Editor,
    BuildEditorProps,
} from "../types/editor";

const buildEditor = ({
    canvas,
    fillColor,
    setFillColor,
    opacity,
    setOpacity,
}: BuildEditorProps): Editor => {
    const centerOnWorkspace = (obj: fabric.Object) => {
        const workspace = canvas.getObjects().find((o) => o.name === "clip");
        if (workspace) {
            obj.set({
                left: workspace.left! + workspace.width! / 2,
                top: workspace.top! + workspace.height! / 2,
                originX: "center",
                originY: "center"
            });
            obj.setCoords();
        } else {
            canvas.centerObject(obj);
        }
    };

    return {
        canvas,
        selectedObjects: canvas.getActiveObjects(),
        addRect: () => {
            console.log("Adding Rectangle...");
            const rect = new fabric.Rect({
                height: 100,
                width: 100,
                fill: fillColor,
                opacity: opacity,
            });
            canvas.add(rect);
            centerOnWorkspace(rect);
            canvas.setActiveObject(rect);
            canvas.renderAll();
        },
        addCircle: () => {
            console.log("Adding Circle...");
            const circle = new fabric.Circle({
                radius: 50,
                fill: fillColor,
                opacity: opacity,
            });
            canvas.add(circle);
            centerOnWorkspace(circle);
            canvas.setActiveObject(circle);
            canvas.renderAll();
        },
        addTriangle: () => {
            console.log("Adding Triangle...");
            const triangle = new fabric.Triangle({
                width: 100,
                height: 100,
                fill: fillColor,
                opacity: opacity,
            });
            canvas.add(triangle);
            centerOnWorkspace(triangle);
            canvas.setActiveObject(triangle);
            canvas.renderAll();
        },
        addText: (value: string) => {
            console.log("Adding Text...");
            const text = new fabric.IText(value, {
                fill: fillColor,
                opacity: opacity,
                fontSize: 32,
            });
            canvas.add(text);
            centerOnWorkspace(text);
            canvas.setActiveObject(text);
            canvas.renderAll();
        },
        addImage: (url: string) => {
            console.log("Adding Image:", url);
            fabric.Image.fromURL(url, (img) => {
                img.scaleToWidth(200);
                canvas.add(img);
                centerOnWorkspace(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
            }, { crossOrigin: 'anonymous' });
        },
        addSmartField: (field: string) => {
            console.log("Adding Smart Field:", field);
            const text = new fabric.IText(field, {
                fill: "#1e293b",
                opacity: 1,
                fontSize: 32,
                fontFamily: "Inter",
                fontWeight: "bold"
            });
            canvas.add(text);
            centerOnWorkspace(text);
            canvas.setActiveObject(text);
            canvas.renderAll();
        },
        setBackgroundImage: (url: string) => {
            const workspace = canvas.getObjects().find((o) => o.name === "clip");
            if (!workspace) return;

            fabric.Image.fromURL(url, (img) => {
                // Scale to cover the workspace
                const workspaceWidth = workspace.width! * workspace.scaleX!;
                const workspaceHeight = workspace.height! * workspace.scaleY!;

                const imgRatio = img.width! / img.height!;
                const workspaceRatio = workspaceWidth / workspaceHeight;

                if (imgRatio > workspaceRatio) {
                    img.scaleToHeight(workspaceHeight);
                } else {
                    img.scaleToWidth(workspaceWidth);
                }

                canvas.add(img);

                // Center relative to workspace
                img.set({
                    left: workspace.left! + workspaceWidth / 2,
                    top: workspace.top! + workspaceHeight / 2,
                    originX: "center",
                    originY: "center"
                });

                // Move to position 1 (right above workspace which is at 0)
                // If workspace is white/opaque, we need to ensure this is visible. 
                // Since this is a "background" image, maybe we just put it on top of workspace.
                img.moveTo(1);

                // Deselect everything else and select this background to allow adjustments if needed
                canvas.setActiveObject(img);
                canvas.renderAll();
            }, { crossOrigin: 'anonymous' });
        },
        delete: () => {
            canvas.getActiveObjects().forEach((obj) => canvas.remove(obj));
            canvas.discardActiveObject();
            canvas.renderAll();
        },
        changeFillColor: (value: string) => {
            setFillColor(value);
            canvas.getActiveObjects().forEach((obj) => {
                obj.set("fill", value);
            });
            canvas.renderAll();
        },
        changeOpacity: (value: number) => {
            setOpacity(value);
            canvas.getActiveObjects().forEach((obj) => {
                obj.set("opacity", value);
            });
            canvas.renderAll();
        },
        getActiveOpacity: () => {
            const selectedObject = canvas.getActiveObject();
            if (!selectedObject) return opacity;
            return selectedObject.get("opacity") || opacity;
        },
        loadDesign: (json: any) => {
            canvas.loadFromJSON(json, () => {
                // Ensure workspace/clip path is re-applied if lost
                const workspace = canvas.getObjects().find((o) => o.name === "clip");
                if (workspace) {
                    canvas.clipPath = workspace;
                }
                canvas.renderAll();
            });
        },
    };
};

export const useEditor = () => {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [fillColor, setFillColor] = useState("#000000");
    const [opacity, setOpacity] = useState(1);
    const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

    useCanvasEvents({
        canvas,
        setSelectedObjects,
    });

    const editor = useMemo(() => {
        if (canvas) {
            return buildEditor({
                canvas,
                fillColor,
                setFillColor,
                opacity,
                setOpacity,
            });
        }
        return undefined;
    }, [canvas, fillColor, opacity]);

    const init = useCallback(({
        initialCanvas,
        initialContainer,
    }: {
        initialCanvas: fabric.Canvas;
        initialContainer: HTMLDivElement;
    }) => {
        fabric.Object.prototype.set({
            cornerColor: "#FFF",
            cornerStyle: "circle",
            borderColor: "#3b82f6",
            borderScaleFactor: 1.5,
            transparentCorners: false,
            borderOpacityWhenMoving: 1,
            cornerStrokeColor: "#3b82f6",
        });

        setCanvas(initialCanvas);
    }, []);

    return { init, editor };
};
