import React from 'react';
import { Handle } from 'reactflow';

export const PreparationNode = ({ data }) => {
    const text = data.label || ""; // Get the label text
    const color = data.color || "lightgreen"; // Default color if none is provided
    let fontSize = 8; // Font size in px
    const padding = 10; // Padding around the text
    const maxTextWidth = 80; // Max width before wrapping text
    const minFontSize = 6; // Minimum font size
    const lineHeightMultiplier = 1.2; // Line height for text

    // Function to calculate the estimated text width and height
    const calculateTextDimensions = (fontSize) => {
        const lineHeight = fontSize * lineHeightMultiplier;
        const lines = text.split(/\s+/).reduce((lines, word) => {
            const line = lines[lines.length - 1] || "";
            const testLine = line + (line.length ? " " : "") + word;
            const testLineWidth = testLine.length * (fontSize * 0.6); // Estimate line width

            if (testLineWidth > maxTextWidth) {
                lines.push(word);
            } else {
                lines[lines.length - 1] = testLine;
            }
            return lines;
        }, [""]);

        const textWidth = Math.min(
            maxTextWidth,
            Math.max(...lines.map(line => line.length * (fontSize * 0.6))) + padding * 2
        );
        const textHeight = lines.length * lineHeight + padding * 2;

        return { lines, textWidth, textHeight };
    };

    // Adjust font size until the text fits within the node
    let { lines, textWidth, textHeight } = calculateTextDimensions(fontSize);
    while (textWidth > maxTextWidth && fontSize > minFontSize) {
        fontSize -= 1;
        ({ lines, textWidth, textHeight } = calculateTextDimensions(fontSize));
    }

    // Set the size of the parallelogram
    const width = Math.max(textWidth, 80);
    const height = Math.max(textHeight, 80);

    return (
        <div style={{ position: 'relative', width: `${width}px`, height: `${height}px` }}>
            <svg width={width} height={height}>
                {/* Draw the parallelogram */}
                <polygon
                    points={`10,0 ${width - 10},0 ${width - 20},${height} 20,${height}`}
                    style={{ fill: color, stroke: "black", strokeWidth: 1 }}
                />
                {/* Insert text */}
                <foreignObject x="10" y="10" width={width - 20} height={height - 20}>
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ textAlign: 'center', wordWrap: 'break-word', fontSize: `${fontSize}px`, fontWeight: 'bold' }}>
                        {lines.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                    </div>
                </foreignObject>
            </svg>
            {/* Handles for the node */}
            <Handle type="source" position="top" id="top" style={{ top: '-1px', left: '50%', transform: 'translateX(-50%)' }} className="bg-gray-800 opacity-0 hover:opacity-100" />
            <Handle type="source" position="right" id="right" style={{ right: '-1px', top: '50%', transform: 'translateY(-50%)' }} className="bg-gray-800 opacity-0 hover:opacity-100" />
            <Handle type="target" position="left" id="left" style={{ left: '-1px', top: '50%', transform: 'translateY(-50%)' }} className="bg-gray-800 opacity-0 hover:opacity-100" />
            <Handle type="target" position="bottom" id="bottom" style={{ bottom: '-1px', left: '50%', transform: 'translateX(-50%)' }} className="bg-gray-800 opacity-0 hover:opacity-100" />
        </div>
    );
};