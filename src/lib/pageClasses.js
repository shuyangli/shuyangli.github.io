// Replicates Middleman's page_classes helper, which the stylesheets rely on
// (e.g. body.photography): "/" -> "index", "/portfolio/cep" ->
// "portfolio portfolio_cep portfolio_cep_index".
export function pageClasses(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'index';

  const classes = [];
  let acc = '';
  for (const segment of segments) {
    acc = acc ? `${acc}_${segment}` : segment;
    classes.push(acc);
  }
  classes.push(`${acc}_index`);
  return classes.join(' ');
}
