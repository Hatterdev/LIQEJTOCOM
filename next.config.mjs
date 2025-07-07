import withTM from 'next-transpile-modules';

// Coloque o nome exato do pacote que precisa ser transpileado
const withTMConfig = withTM(['@coinbase/wallet-sdk']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // outras configs que quiser adicionar
};

export default withTMConfig(nextConfig);
