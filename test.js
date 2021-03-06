/* eslint-env mocha */

import chai, {expect} from 'chai';
import chaiString from 'chai-string';
import markdownit from 'markdown-it';
import markdownItPrism from './index';
import fs from 'fs';

chai.use(chaiString);

const read = path => fs.readFileSync(`testdata/${path}`).toString();

describe('markdown-it-prism', () => {

	it('highlights fenced code blocks with language specification using Prism', () => {
		expect(markdownit()
			.use(markdownItPrism)
			.render(read('input/fenced-with-language.md'))
		).to.equalIgnoreSpaces(read('expected/fenced-with-language.html'));
	});

	it('throws for unknown plugins', () => {
		expect(() => markdownit()
			.use(markdownItPrism, {
				plugins: ['foo']
			})).to.throw(Error, /plugin/);
	});

	it('offers an init function for further initialisation', () => {
		let called = false;
		markdownit()
			.use(markdownItPrism, {
				init: prism => {
					expect(prism).to.have.ownProperty('plugins');
					called = true;
				}
			});
		expect(called).to.be.true;
	});

	it('does not add classes to fenced code blocks without language specification', () => {
		expect(markdownit()
			.use(markdownItPrism)
			.render(read('input/fenced-without-language.md'))
		).to.equalIgnoreSpaces(read('expected/fenced-without-language.html'));
	});

	it('does not add classes to indented code blocks', () => {
		expect(markdownit()
			.use(markdownItPrism)
			.render(read('input/indented.md'))
		).to.equalIgnoreSpaces(read('expected/indented.html'));

	});

	it('adds classes even if the language is unknown', () => {
		expect(markdownit()
			.use(markdownItPrism)
			.render(read('input/fenced-with-unknown-language.md'))
		).to.equalIgnoreSpaces(read('expected/fenced-with-unknown-language.html'));
	});

	it('respects markdown-it’s langPrefix setting', () => {
		expect(
			markdownit({
				langPrefix: 'test-'
			})
				.use(markdownItPrism)
				.render(read('input/fenced-with-language.md'))
		).to.equalIgnoreSpaces(read('expected/fenced-with-language-prefix.html'));
	});

	// This test must be the last one, as the plugins get loaded into Prism and cannot be unloaded!
	it('allows to use Prism plugins', () => {
		expect(markdownit()
			.use(markdownItPrism, {
				plugins: [
					'highlight-keywords',
					'show-language'
				]
			})
			.render(read('input/fenced-with-language.md'))
		).to.equalIgnoreSpaces(read('expected/fenced-with-language-plugins.html'));
	});
});
