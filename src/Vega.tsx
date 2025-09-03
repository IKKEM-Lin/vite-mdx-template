import { VegaEmbed } from 'react-vega';
import React from 'react';
import type { VisualizationSpec, EmbedOptions } from 'vega-embed';

interface VegaProps {
  spec: VisualizationSpec | string;
  options?: EmbedOptions;
}

const Vega: React.FC<VegaProps> = ({ spec, options }) => {
  return (
    <VegaEmbed
      spec={spec}
      options={
        options || {
          mode: 'vega-lite',
        }
      }
    />
  );
};

export default Vega;
