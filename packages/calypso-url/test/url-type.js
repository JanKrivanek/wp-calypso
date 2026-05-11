/**
 * @jest-environment jsdom
 */

import { determineUrlType, URL_TYPE } from '../src';

describe( 'determineUrlType', () => {
	describe( 'absolute URLs', () => {
		test( 'should classify standard http/https URLs as ABSOLUTE', () => {
			expect( determineUrlType( 'http://example.com' ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( 'https://example.com' ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( 'http://example.com/' ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( 'https://example.com/path/to/page' ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( 'http://example.com/foo?b=a#z' ) ).toBe( URL_TYPE.ABSOLUTE );
		} );

		test( 'should classify URLs with ports as ABSOLUTE', () => {
			expect( determineUrlType( 'http://example.com:8080' ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( 'https://example.com:443/path' ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( 'http://localhost:3000' ) ).toBe( URL_TYPE.ABSOLUTE );
		} );

		test( 'should classify URLs with authentication credentials as ABSOLUTE', () => {
			expect( determineUrlType( 'https://user:password@example.org/' ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( 'http://user@example.com' ) ).toBe( URL_TYPE.ABSOLUTE );
		} );

		test( 'should classify file:// URLs as ABSOLUTE', () => {
			expect( determineUrlType( 'file:///C:/demo' ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( 'file:///path/to/file' ) ).toBe( URL_TYPE.ABSOLUTE );
		} );

		test( 'should classify URL objects as ABSOLUTE', () => {
			expect( determineUrlType( new URL( 'http://example.com' ) ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( new URL( 'https://example.com/path' ) ) ).toBe( URL_TYPE.ABSOLUTE );
		} );

		test( 'should classify edge case URLs from the URL spec as ABSOLUTE', () => {
			// Normalization examples from https://url.spec.whatwg.org/#urls
			expect( determineUrlType( 'https:example.org' ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( 'https://////example.com///' ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( 'https://example.com/././foo' ) ).toBe( URL_TYPE.ABSOLUTE );
			expect( determineUrlType( 'https://EXAMPLE.com/../x' ) ).toBe( URL_TYPE.ABSOLUTE );
		} );
	} );

	describe( 'protocol-relative URLs', () => {
		test( 'should classify URLs starting with // as SCHEME_RELATIVE', () => {
			expect( determineUrlType( '//example.com' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
			expect( determineUrlType( '//example.com/' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
			expect( determineUrlType( '//example.com/path' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
			expect( determineUrlType( '//example.com:8080' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
			expect( determineUrlType( '//example.com/foo?b=a#z' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
			expect( determineUrlType( '//www.example.com' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
		} );
	} );

	describe( 'root-relative URLs', () => {
		test( 'should classify URLs starting with a single slash as PATH_ABSOLUTE', () => {
			expect( determineUrlType( '/' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
			expect( determineUrlType( '/path' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
			expect( determineUrlType( '/path/to/page' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
			expect( determineUrlType( '/foo?b=a#z' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
			expect( determineUrlType( '/foo/bar/../baz' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
		} );
	} );

	describe( 'path-relative URLs', () => {
		test( 'should classify relative paths as PATH_RELATIVE', () => {
			expect( determineUrlType( 'foo' ) ).toBe( URL_TYPE.PATH_RELATIVE );
			expect( determineUrlType( 'foo/bar' ) ).toBe( URL_TYPE.PATH_RELATIVE );
			expect( determineUrlType( '../foo' ) ).toBe( URL_TYPE.PATH_RELATIVE );
			expect( determineUrlType( './foo' ) ).toBe( URL_TYPE.PATH_RELATIVE );
		} );

		test( 'should classify an empty string as PATH_RELATIVE', () => {
			expect( determineUrlType( '' ) ).toBe( URL_TYPE.PATH_RELATIVE );
		} );

		test( 'should classify query-only strings as PATH_RELATIVE', () => {
			expect( determineUrlType( '?query=value' ) ).toBe( URL_TYPE.PATH_RELATIVE );
			expect( determineUrlType( '?foo=1&bar=2' ) ).toBe( URL_TYPE.PATH_RELATIVE );
		} );

		test( 'should classify fragment-only strings as PATH_RELATIVE', () => {
			expect( determineUrlType( '#section' ) ).toBe( URL_TYPE.PATH_RELATIVE );
			expect( determineUrlType( '#' ) ).toBe( URL_TYPE.PATH_RELATIVE );
		} );
	} );

	describe( 'invalid URLs', () => {
		test( 'should classify non-string inputs as INVALID', () => {
			expect( determineUrlType( null ) ).toBe( URL_TYPE.INVALID );
			expect( determineUrlType( undefined ) ).toBe( URL_TYPE.INVALID );
			expect( determineUrlType( 42 ) ).toBe( URL_TYPE.INVALID );
			expect( determineUrlType( {} ) ).toBe( URL_TYPE.INVALID );
			expect( determineUrlType( [] ) ).toBe( URL_TYPE.INVALID );
			expect( determineUrlType( true ) ).toBe( URL_TYPE.INVALID );
		} );

		test( 'should classify malformed URL patterns as INVALID', () => {
			expect( determineUrlType( '///' ) ).toBe( URL_TYPE.INVALID );
		} );
	} );
} );
