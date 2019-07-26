import typescript from 'rollup-plugin-typescript';

export default [{
    input: './MMM-edgerouter-throughput.ts',
    plugins: [
        typescript()
    ],
    output: {
        file: 'MMM-edgerouter-throughput.js',
        format: 'iife'
    }
}]
