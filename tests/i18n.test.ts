import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import ts from 'typescript';
import { localeTools, normalizeLocale } from '../lib/i18n.ts';
import { english } from '../lib/translations.ts';
test('locale defaults safely and formats numbers, units, dates and text', () => {
  assert.equal(normalizeLocale('fr'), 'bn');
  const en=localeTools('en'), bn=localeTools('bn');
  assert.equal(en.t(' সাইন ইন '), ' Sign in ');
  assert.equal(bn.t('সাইন ইন'), 'সাইন ইন');
  assert.equal(en.bn('১,৮৫০'), '1,850');
  assert.equal(bn.bn(1850), '১,৮৫০');
  assert.equal(en.unitLabel('kg'), 'kg');
  assert.equal(bn.unitLabel('kg'), 'কেজি');
  assert.match(en.banglaDate(new Date('2026-10-09T00:00:00Z')), /October/);
  assert.equal(en.t('Unknown product'), 'Unknown product');
});
test('every supplied product, category, market and division has an English label', () => {
  const en=localeTools('en');
  for (const file of ['products','categories']) {
    const data=JSON.parse(readFileSync(new URL(`../data/${file}.json`,import.meta.url),'utf8'));
    for (const p of data) {
      const labels=[p.nameBn,p.categoryNameBn,...(p.markets||[]).flatMap((m: {market:string;division:string})=>[m.market,m.division])].filter(Boolean);
      for(const label of labels) assert.doesNotMatch(en.t(label), /[\u0980-\u09ff]/, label);
    }
  }
});
test('all literal translation calls in app and components have dictionary entries', () => {
  function inspect(dir:string) {
    for(const entry of readdirSync(dir,{withFileTypes:true})) {
      const path=`${dir}/${entry.name}`;
      if(entry.isDirectory()){inspect(path);continue;}
      if(!path.endsWith('.tsx'))continue;
      const source=ts.createSourceFile(path,readFileSync(path,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
      function walk(n:ts.Node) {
        if(ts.isCallExpression(n)&&n.expression.getText(source)==='t'&&ts.isStringLiteral(n.arguments[0])) {
          const key=n.arguments[0].text.trim();assert.ok(key in english, `${path}: ${key}`);
        }
        ts.forEachChild(n,walk);
      }
      walk(source);
    }
  }
  inspect('app');inspect('components');
});
