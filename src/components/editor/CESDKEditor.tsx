"use client";

import { useEffect, useRef, useState } from "react";

// @ts-ignore
let CreativeEditorSDK: any;
if (typeof window !== "undefined") {
    CreativeEditorSDK = require("@cesdk/cesdk-js");
}

interface CESDKEditorProps {
    orientation: 'landscape' | 'portrait';
    onSave: (designJson: string) => void;
    onOrientationChange: (orientation: 'landscape' | 'portrait') => void;
    onBack: () => void;
}

export default function CESDKEditor({ orientation, onSave, onOrientationChange, onBack }: CESDKEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cesdkRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let cesdk: any;
        const config: any = {
            license: process.env.NEXT_PUBLIC_CESDK_LICENSE, // Omit/undefined triggers evaluation mode in 1.66.1+
            baseURL: "https://cdn.img.ly/packages/imgly/cesdk-js/1.66.1/assets",
            i18n: {
                locale: 'tr'
            },
            ui: {
                elements: {
                    navigation: {
                        showLogo: false,
                        action: {
                            export: true,
                            resize: false
                        }
                    },
                    panels: {
                        settings: true,
                    },
                },
            },
            callbacks: {
                onSave: (scene: string) => {
                    onSave(scene);
                },
                onExport: (blobs: any) => {
                    console.log("Exported blobs", blobs);
                }
            },
        };

        const SDK = CreativeEditorSDK.default || CreativeEditorSDK;
        SDK.create(containerRef.current, config).then((instance: any) => {
            cesdk = instance;
            cesdkRef.current = instance;

            // Register back button (DOM based)
            cesdk.ui.registerComponent('custom-back', () => {
                const btn = document.createElement('button');
                btn.innerText = 'GERİDÖN';
                btn.style.padding = '8px 12px';
                btn.style.borderRadius = '8px';
                btn.style.cursor = 'pointer';
                btn.style.border = '1px solid #E2E8F0';
                btn.style.fontSize = '10px';
                btn.style.fontWeight = 'bold';
                btn.style.backgroundColor = '#FFFFFF';
                btn.style.marginRight = '8px';
                btn.onclick = () => onBack();
                return btn;
            });

            // Register custom orientation buttons
            cesdk.ui.registerComponent('orientation-landscape', () => {
                const btn = document.createElement('button');
                btn.innerText = 'A4 YATAY';
                btn.style.padding = '8px 16px';
                btn.style.borderRadius = '8px';
                btn.style.cursor = 'pointer';
                btn.style.border = orientation === 'landscape' ? '1px solid #005DFF' : '1px solid #E2E8F0';
                btn.style.fontSize = '10px';
                btn.style.fontWeight = 'bold';
                btn.style.backgroundColor = orientation === 'landscape' ? '#005DFF' : '#FFFFFF';
                btn.style.color = orientation === 'landscape' ? '#FFFFFF' : '#64748B';
                btn.onclick = () => onOrientationChange('landscape');
                return btn;
            });

            cesdk.ui.registerComponent('orientation-portrait', () => {
                const btn = document.createElement('button');
                btn.innerText = 'A4 DİKEY';
                btn.style.padding = '8px 16px';
                btn.style.borderRadius = '8px';
                btn.style.cursor = 'pointer';
                btn.style.border = orientation === 'portrait' ? '1px solid #005DFF' : '1px solid #E2E8F0';
                btn.style.fontSize = '10px';
                btn.style.fontWeight = 'bold';
                btn.style.backgroundColor = orientation === 'portrait' ? '#005DFF' : '#FFFFFF';
                btn.style.color = orientation === 'portrait' ? '#FFFFFF' : '#64748B';
                btn.onclick = () => onOrientationChange('portrait');
                return btn;
            });

            // Set Navigation Bar Order
            cesdk.ui.setNavigationBarOrder([
                'custom-back',
                'ly.img.spacer',
                'orientation-landscape',
                'orientation-portrait',
                'ly.img.spacer',
                'ly.img.export.navigationBar'
            ]);

            // Basic Scene Setup
            cesdk.engine.scene.create();

            // Create a page
            const scene = cesdk.engine.scene.get();
            const page = cesdk.engine.block.create('page');
            cesdk.engine.block.appendChild(scene, page);

            // Set Page Size (A4 Landscape approx)
            if (page) {
                const isLandscape = orientation === 'landscape';
                cesdk.engine.block.setFloat(page, 'width', isLandscape ? 842 : 595);
                cesdk.engine.block.setFloat(page, 'height', isLandscape ? 595 : 842);
            }

            // Add user's signature as a custom asset if available
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user.signature_url) {
                    cesdk.engine.asset.addSource({
                        id: "user-signature",
                        title: "Kurumsal İmza",
                        type: "image",
                        groups: [
                            {
                                id: "signature",
                                title: "İmzam",
                                assets: [
                                    {
                                        id: "signature-1",
                                        thumbUri: user.signature_url,
                                        uri: user.signature_url,
                                        label: "İmza",
                                        meta: {
                                            width: 400,
                                            height: 200
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                }
            }
        });

        return () => {
            if (cesdk) {
                cesdk.dispose();
            }
        };
    }, []);

    // Handle orientation changes without remounting
    useEffect(() => {
        const cesdk = cesdkRef.current;
        if (!cesdk) return;

        const page = cesdk.engine.block.findByType('page')[0];
        if (page) {
            const isLandscape = orientation === 'landscape';
            cesdk.engine.block.setFloat(page, 'width', isLandscape ? 842 : 595);
            cesdk.engine.block.setFloat(page, 'height', isLandscape ? 595 : 842);
        }

        // Re-register components to update their active state
        cesdk.ui.registerComponent('custom-back', () => {
            const btn = document.createElement('button');
            btn.innerText = 'GERİDÖN';
            btn.style.padding = '8px 12px';
            btn.style.borderRadius = '8px';
            btn.style.cursor = 'pointer';
            btn.style.border = '1px solid #E2E8F0';
            btn.style.fontSize = '10px';
            btn.style.fontWeight = 'bold';
            btn.style.backgroundColor = '#FFFFFF';
            btn.style.marginRight = '8px';
            btn.onclick = () => onBack();
            return btn;
        });

        cesdk.ui.registerComponent('orientation-landscape', () => {
            const btn = document.createElement('button');
            btn.innerText = 'A4 YATAY';
            btn.style.padding = '8px 16px';
            btn.style.borderRadius = '8px';
            btn.style.cursor = 'pointer';
            btn.style.border = orientation === 'landscape' ? '1px solid #005DFF' : '1px solid #E2E8F0';
            btn.style.fontSize = '10px';
            btn.style.fontWeight = 'bold';
            btn.style.backgroundColor = orientation === 'landscape' ? '#005DFF' : '#FFFFFF';
            btn.style.color = orientation === 'landscape' ? '#FFFFFF' : '#64748B';
            btn.onclick = () => onOrientationChange('landscape');
            return btn;
        });

        cesdk.ui.registerComponent('orientation-portrait', () => {
            const btn = document.createElement('button');
            btn.innerText = 'A4 DİKEY';
            btn.style.padding = '8px 16px';
            btn.style.borderRadius = '8px';
            btn.style.cursor = 'pointer';
            btn.style.border = orientation === 'portrait' ? '1px solid #005DFF' : '1px solid #E2E8F0';
            btn.style.fontSize = '10px';
            btn.style.fontWeight = 'bold';
            btn.style.backgroundColor = orientation === 'portrait' ? '#005DFF' : '#FFFFFF';
            btn.style.color = orientation === 'portrait' ? '#FFFFFF' : '#64748B';
            btn.onclick = () => onOrientationChange('portrait');
            return btn;
        });

        // Re-apply the navigation order
        cesdk.ui.setNavigationBarOrder([
            'custom-back',
            'ly.img.spacer',
            'orientation-landscape',
            'orientation-portrait',
            'ly.img.spacer',
            'ly.img.export.navigationBar'
        ]);
    }, [orientation]);

    return (
        <div ref={containerRef} className="w-full h-full" />
    );
}
