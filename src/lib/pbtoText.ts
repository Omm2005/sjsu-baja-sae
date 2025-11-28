export type PTChild = { _type?: string; text?: string }
export type PTBlock = { _type?: string; children?: PTChild[] }

export function portableTextToPlainText(blocks: PTBlock[] = []): string {
  return blocks
    .filter(b => b && b._type === 'block')
    .map(b => (b.children || []).map(c => c.text || '').join(''))
    .join('\n\n')
}
