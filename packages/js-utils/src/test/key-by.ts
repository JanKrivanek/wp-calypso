import keyBy from '../key-by';

describe( 'keyBy', () => {
	it( 'transforms keys using a custom iteratee function', () => {
		const collection = [
			{ id: 'a', value: 1 },
			{ id: 'b', value: 2 },
			{ id: 'c', value: 3 },
		];
		const result = keyBy( collection, ( item ) => item.id.toUpperCase() );
		expect( result ).toEqual( {
			A: { id: 'a', value: 1 },
			B: { id: 'b', value: 2 },
			C: { id: 'c', value: 3 },
		} );
	} );

	it( 'uses property name shorthand as the iteratee', () => {
		const collection = [
			{ slug: 'foo', label: 'Foo' },
			{ slug: 'bar', label: 'Bar' },
		];
		const result = keyBy( collection, 'slug' );
		expect( result ).toEqual( {
			foo: { slug: 'foo', label: 'Foo' },
			bar: { slug: 'bar', label: 'Bar' },
		} );
	} );

	it( 'handles inherited property names like constructor and hasOwnProperty', () => {
		const collection = [
			{ name: 'constructor', value: 1 },
			{ name: 'hasOwnProperty', value: 2 },
		];
		const result = keyBy( collection, 'name' );
		expect( result ).toEqual( {
			constructor: { name: 'constructor', value: 1 },
			hasOwnProperty: { name: 'hasOwnProperty', value: 2 },
		} );
		expect( result[ 'constructor' ] ).toEqual( { name: 'constructor', value: 1 } );
		expect( result[ 'hasOwnProperty' ] ).toEqual( { name: 'hasOwnProperty', value: 2 } );
	} );

	it( 'uses a numeric index as the iteratee for arrays of arrays', () => {
		const collection = [
			[ 'alpha', 10 ],
			[ 'beta', 20 ],
			[ 'gamma', 30 ],
		];
		const result = keyBy( collection, 0 );
		expect( result ).toEqual( {
			alpha: [ 'alpha', 10 ],
			beta: [ 'beta', 20 ],
			gamma: [ 'gamma', 30 ],
		} );
	} );

	it( 'accepts an object as the collection input instead of an array', () => {
		const collection = {
			x: { id: 1, name: 'one' },
			y: { id: 2, name: 'two' },
			z: { id: 3, name: 'three' },
		};
		const result = keyBy( collection, 'name' );
		expect( result ).toEqual( {
			one: { id: 1, name: 'one' },
			two: { id: 2, name: 'two' },
			three: { id: 3, name: 'three' },
		} );
	} );
} );
