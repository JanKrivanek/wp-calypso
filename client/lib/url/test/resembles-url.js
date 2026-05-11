/**
 * @jest-environment jsdom
 */

import resemblesUrl from '../resembles-url';

describe( 'resemblesUrl()', () => {
	test( 'should return true for a fully-formed URL with a protocol prefix', () => {
		expect( resemblesUrl( 'https://example.com' ) ).toBe( true );
	} );

	test( 'should return true for a domain-only input without a protocol scheme', () => {
		expect( resemblesUrl( 'example.com' ) ).toBe( true );
	} );

	test( 'should return true for a URL containing query string parameters', () => {
		expect( resemblesUrl( 'https://example.com/page?foo=bar&baz=qux' ) ).toBe( true );
	} );

	test( 'should return true for a URL with a short two-character TLD suffix', () => {
		expect( resemblesUrl( 'example.co' ) ).toBe( true );
	} );

	test( 'should return false for a malformed input with consecutive dots', () => {
		expect( resemblesUrl( 'example..c' ) ).toBe( false );
	} );

	test( 'should return false for an input with dots separated by spaces', () => {
		expect( resemblesUrl( 'example . com' ) ).toBe( false );
	} );

	test( 'should return false for an edge case of a single dot character', () => {
		expect( resemblesUrl( '.' ) ).toBe( false );
	} );

	test( 'should return false for a plain string that lacks any dot separator', () => {
		expect( resemblesUrl( 'examplecom' ) ).toBe( false );
	} );
} );
