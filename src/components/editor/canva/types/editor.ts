import { fabric } from "fabric";

export type EditorMode = "SELECT" | "DRAW";

export interface Editor {
    addRect: () => void;
    addCircle: () => void;
    addTriangle: () => void;
    addText: (value: string) => void;
    addImage: (url: string) => void;
    addSmartField: (field: string) => void;
    setBackgroundImage: (url: string) => void;
    delete: () => void;
    changeFillColor: (value: string) => void;
    changeOpacity: (value: number) => void;
    getActiveOpacity: () => number;
    loadDesign: (json: any) => void;
    canvas: fabric.Canvas;
    selectedObjects: fabric.Object[];
}

export interface BuildEditorProps {
    canvas: fabric.Canvas;
    fillColor: string;
    setFillColor: (value: string) => void;
    opacity: number;
    setOpacity: (value: number) => void;
}
