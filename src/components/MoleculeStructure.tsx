/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RDKitModule, JSMol } from "@rdkit/rdkit";
import React from "react";
import {useEffect, useState } from "react";

interface MoleculeStructureProps {
  id: string;
  className?: string;
  svgMode?: boolean;
  width?: number;
  height?: number;
  structure: string;
  subStructure?: string;
  extraDetails?: Record<string, any>;
  tooltip?: string;
  drawingDelay?: number;
}

const defaultProps = {
  subStructure: "",
  className: "",
  width: 90,
  height: 50,
  svgMode: true,
  extraDetails: {},
  drawingDelay: 0,
};

const MoleculeStructure: React.FC<MoleculeStructureProps> = (props) => {
  const [svg, setSvg] = useState<string>();
  // const [rdKitLoaded, setRdKitLoaded] = useState(false);
  // const [rdKitError, setRdKitError] = useState(false);
  const RDKit = (window as any).RDKit as RDKitModule;

  useEffect(() => {
    try {
      draw();
    } catch (err) {
      console.log(err);
    }
  }, [RDKit, props]);

  if (!RDKit) return "RDKit Error...";

  const {
    id,
    className,
    svgMode,
    width,
    height,
    structure,
    subStructure,
    extraDetails,
    tooltip,
    drawingDelay,
  } = { ...defaultProps, ...props };
  const MOL_DETAILS = {
    width: width,
    height: height,
    bondLineWidth: 1,
    addStereoAnnotation: true,
    ...extraDetails,
  };

  const getMolDetails = (mol: JSMol | null, qmol: JSMol | null) => {
    if (!!mol && !!qmol) {
      const subStructHighlightDetails: Array<{ bonds: any[]; atoms: any[] }> =
        JSON.parse(mol.get_substruct_matches(qmol));
      const subStructHighlightDetailsMerged = subStructHighlightDetails
        ? subStructHighlightDetails.reduce(
            (acc, { atoms, bonds }) => ({
              atoms: [...acc.atoms, ...atoms],
              bonds: [...acc.bonds, ...bonds],
            }),
            { bonds: [], atoms: [] }
          )
        : subStructHighlightDetails;
      return JSON.stringify({
        ...MOL_DETAILS,
        ...(extraDetails || {}),
        ...subStructHighlightDetailsMerged,
      });
    } else {
      return JSON.stringify({
        ...MOL_DETAILS,
        ...(extraDetails || {}),
      });
    }
  };

  const drawSVGorCanvas = () => {
    if (!RDKit) return;
    const mol = RDKit.get_mol(structure || "invalid");
    const qmol = RDKit.get_qmol(subStructure || "invalid");
    const isValidMol = !!mol;

    if (svgMode && isValidMol) {
      const svg = mol?.get_svg_with_highlights(getMolDetails(mol, qmol));
      setSvg(svg);
    } else if (isValidMol) {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (!canvas) return;
      mol.draw_to_canvas_with_highlights(canvas, getMolDetails(mol, qmol));
    }

    /**
     * Delete C++ mol objects manually
     * https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#memory-management
     */
    mol?.delete();
    qmol?.delete();
  };

  const draw = () => {
    if (drawingDelay) {
      setTimeout(() => {
        drawSVGorCanvas();
      }, drawingDelay);
    } else {
      drawSVGorCanvas();
    }
  };

  // const drawOnce = (() => {
  //   let wasCalled = false;

  //   return () => {
  //     if (!wasCalled) {
  //       wasCalled = true;
  //       draw();
  //     }
  //   };
  // })();

  // if (rdKitError) {
  //   return "Error loading renderer.";
  // }
  // if (!rdKitLoaded) {
  //   return "Loading renderer...";
  // }

  if (!RDKit) return "RDKit Error...";

  const mol = RDKit.get_mol(structure || "invalid");
  const isValidMol = !!mol;
  mol?.delete();

  if (!isValidMol) {
    return (
      <span title={`Cannot render structure: ${structure}`}>Render Error.</span>
    );
  } else if (svgMode) {
    return (
      <div
        title={tooltip || structure}
        className={"molecule-structure-svg " + (className || "")}
        style={{ width: width, height: height }}
        dangerouslySetInnerHTML={{ __html: svg || "" }}
      ></div>
    );
  } else {
    return (
      <div className={"molecule-canvas-container " + (className || "")}>
        <canvas
          title={tooltip || structure}
          id={id}
          width={width}
          height={height}
        ></canvas>
      </div>
    );
  }
};

export default MoleculeStructure;