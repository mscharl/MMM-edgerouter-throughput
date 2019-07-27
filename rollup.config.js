import banner from 'rollup-plugin-banner';
import typescript from 'rollup-plugin-typescript';

const bannerText = [
    'EdgeRouter Throughput',
    '<%= pkg.description %>',
    '',
    'Version <%= pkg.version %>',
    'By <%= pkg.author %>',
    '',
    'License <%= pkg.license %>',
].join('\n');

export default [{
    input: './MMM-edgerouter-throughput.ts',
    plugins: [
        typescript(),
        banner(bannerText),
    ],
    output: {
        file: 'MMM-edgerouter-throughput.js',
        format: 'iife'
    }
}]
