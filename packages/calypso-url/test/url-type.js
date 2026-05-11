/**
 * @jest-environment jsdom
 */

import { determineUrlType, URL_TYPE } from '../src';

describe( 'determineUrlType - absolute URLs', () => {
	test( 'should classify standard http/https URLs as ABSOLUTE', () => {
		expect( determineUrlType( 'http://example.com' ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( 'https://example.com' ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( 'http://example.com/' ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( 'https://example.com/path/to/page' ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( 'http://example.com/foo?bar=baz#hash' ) ).toBe( URL_TYPE.ABSOLUTE );
	} );

	test( 'should classify URLs with ports as ABSOLUTE', () => {
		expect( determineUrlType( 'http://example.com:8080' ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( 'https://example.com:443/path' ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( 'http://localhost:3000' ) ).toBe( URL_TYPE.ABSOLUTE );
	} );

	test( 'should classify URLs with authentication credentials as ABSOLUTE', () => {
		expect( determineUrlType( 'https://user:password@example.com/' ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( 'http://user@example.com' ) ).toBe( URL_TYPE.ABSOLUTE );
	} );

	test( 'should classify file:// URLs as ABSOLUTE', () => {
		expect( determineUrlType( 'file:///C:/demo' ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( 'file:///usr/local/share' ) ).toBe( URL_TYPE.ABSOLUTE );
	} );

	test( 'should classify URL objects as ABSOLUTE', () => {
		expect( determineUrlType( new URL( 'http://example.com' ) ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( new URL( 'https://example.com/path?q=1' ) ) ).toBe( URL_TYPE.ABSOLUTE );
	} );

	test( 'should classify edge-case absolute URLs from the URL spec as ABSOLUTE', () => {
		// Normalization examples from https://url.spec.whatwg.org/#urls
		expect( determineUrlType( 'https:example.org' ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( 'https://////example.com///' ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( 'https://example.com/././foo' ) ).toBe( URL_TYPE.ABSOLUTE );
		expect( determineUrlType( 'https://EXAMPLE.com/../x' ) ).toBe( URL_TYPE.ABSOLUTE );
	} );
} );

describe( 'determineUrlType - protocol-relative URLs', () => {
	test( 'should classify double-slash URLs as SCHEME_RELATIVE', () => {
		expect( determineUrlType( '//example.com' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
		expect( determineUrlType( '//example.com/' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
		expect( determineUrlType( '//example.com/path' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
	} );

	test( 'should classify double-slash URLs with ports as SCHEME_RELATIVE', () => {
		expect( determineUrlType( '//example.com:8080' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
		expect( determineUrlType( '//example.com:8080/path' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
	} );

	test( 'should classify double-slash URLs with query and fragment as SCHEME_RELATIVE', () => {
		expect( determineUrlType( '//example.com/foo?bar=baz' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
		expect( determineUrlType( '//example.com/foo#section' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
		expect( determineUrlType( '//example.com/foo?bar=baz#section' ) ).toBe( URL_TYPE.SCHEME_RELATIVE );
	} );
} );

describe( 'determineUrlType - root-relative URLs', () => {
	test( 'should classify single-slash URLs as PATH_ABSOLUTE', () => {
		expect( determineUrlType( '/' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
		expect( determineUrlType( '/path' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
		expect( determineUrlType( '/path/to/page' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
	} );

	test( 'should classify root-relative URLs with query strings as PATH_ABSOLUTE', () => {
		expect( determineUrlType( '/path?foo=bar' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
		expect( determineUrlType( '/?foo=bar' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
	} );

	test( 'should classify root-relative URLs with fragments as PATH_ABSOLUTE', () => {
		expect( determineUrlType( '/path#section' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
		expect( determineUrlType( '/#section' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
	} );

	test( 'should classify root-relative URLs with both query and fragment as PATH_ABSOLUTE', () => {
		expect( determineUrlType( '/path?foo=bar#section' ) ).toBe( URL_TYPE.PATH_ABSOLUTE );
	} );
} );

describe( 'determineUrlType - path-relative URLs', () => {
	test( 'should classify relative path strings as PATH_RELATIVE', () => {
		expect( determineUrlType( 'foo' ) ).toBe( URL_TYPE.PATH_RELATIVE );
		expect( determineUrlType( 'foo/bar' ) ).toBe( URL_TYPE.PATH_RELATIVE );
		expect( determineUrlType( '../foo' ) ).toBe( URL_TYPE.PATH_RELATIVE );
		expect( determineUrlType( './foo' ) ).toBe( URL_TYPE.PATH_RELATIVE );
	} );

	test( 'should classify the empty string as PATH_RELATIVE', () => {
		expect( determineUrlType( '' ) ).toBe( URL_TYPE.PATH_RELATIVE );
	} );

	test( 'should classify query-only strings as PATH_RELATIVE', () => {
		expect( determineUrlType( '?foo=bar' ) ).toBe( URL_TYPE.PATH_RELATIVE );
		expect( determineUrlType( '?foo=bar&baz=qux' ) ).toBe( URL_TYPE.PATH_RELATIVE );
	} );

	test( 'should classify fragment-only strings as PATH_RELATIVE', () => {
		expect( determineUrlType( '#section' ) ).toBe( URL_TYPE.PATH_RELATIVE );
		expect( determineUrlType( '#' ) ).toBe( URL_TYPE.PATH_RELATIVE );
	} );
} );

describe( 'determineUrlType - invalid URLs', () => {
	test( 'should classify non-string, non-URL inputs as INVALID', () => {
		expect( determineUrlType( null ) ).toBe( URL_TYPE.INVALID );
		expect( determineUrlType( undefined ) ).toBe( URL_TYPE.INVALID );
		expect( determineUrlType( 42 ) ).toBe( URL_TYPE.INVALID );
		expect( determineUrlType( {} ) ).toBe( URL_TYPE.INVALID );
		expect( determineUrlType( [] ) ).toBe( URL_TYPE.INVALID );
		expect( determineUrlType( true ) ).toBe( URL_TYPE.INVALID );
	} );

	test( 'should classify triple-slash URLs as INVALID', () => {
		expect( determineUrlType( '///' ) ).toBe( URL_TYPE.INVALID );
	} );
} );
