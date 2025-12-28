import { useCallback, useRef, useState, useEffect } from "react";
import { fabric } from "fabric";

interface UseHistoryProps {
    canvas: fabric.Canvas | null;
}

export const useHistory = ({ canvas }: UseHistoryProps) => {
    const [historyIndex, setHistoryIndex] = useState(0);
    const canvasHistory = useRef<string[]>([]);
    const skipSave = useRef(false);

    const save = useCallback(() => {
        if (!canvas || skipSave.current) return;

        const json = JSON.stringify(canvas.toJSON());

        if (canvasHistory.current[historyIndex] === json) return;

        const newHistory = canvasHistory.current.slice(0, historyIndex + 1);
        newHistory.push(json);
        canvasHistory.current = newHistory;
        setHistoryIndex(newHistory.length - 1);
    }, [canvas, historyIndex]);

    const undo = useCallback(() => {
        if (historyIndex > 0 && canvas) {
            skipSave.current = true;
            const index = historyIndex - 1;
            const json = canvasHistory.current[index];

            canvas.loadFromJSON(json, () => {
                canvas.renderAll();
                setHistoryIndex(index);
                skipSave.current = false;
            });
        }
    }, [canvas, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < canvasHistory.current.length - 1 && canvas) {
            skipSave.current = true;
            const index = historyIndex + 1;
            const json = canvasHistory.current[index];

            canvas.loadFromJSON(json, () => {
                canvas.renderAll();
                setHistoryIndex(index);
                skipSave.current = false;
            });
        }
    }, [canvas, historyIndex]);

    useEffect(() => {
        if (canvas) {
            canvas.on("object:added", save);
            canvas.on("object:removed", save);
            canvas.on("object:modified", save);
            canvas.on("object:skewing", save);
        }

        return () => {
            if (canvas) {
                canvas.off("object:added");
                canvas.off("object:removed");
                canvas.off("object:modified");
                canvas.off("object:skewing");
            }
        };
    }, [canvas, save]);

    return { undo, redo, save, canUndo: historyIndex > 0, canRedo: historyIndex < canvasHistory.current.length - 1 };
};
