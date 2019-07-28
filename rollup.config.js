import banner from 'rollup-plugin-banner';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';

const bannerText = [
    'EdgeRouter Throughput',
    '<%= pkg.description %>',
    '',
    'Version <%= pkg.version %>',
    'By <%= pkg.author %>',
    '',
    'License <%= pkg.license %>',
    '',
    'This is an autogenerated file. DO NOT EDIT!'
].join('\n');

export default [{
    input: './src/MMM-edgerouter-throughput.ts',
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        banner(bannerText),
    ],
    output: {
        file: './MMM-edgerouter-throughput.js',
        format: 'iife'
    }
}]
