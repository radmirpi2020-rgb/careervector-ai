import adapter from '@sveltejs/adapter-static';

const base = process.env.BASE_PATH ?? '';

export default {
  kit: {
    adapter: adapter({ fallback: 'index.html' }),
    paths: {
      base: base.endsWith('/') ? base.slice(0, -1) : base,
      relative: true
    }
  }
};
