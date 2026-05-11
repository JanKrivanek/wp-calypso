import keyBy from '../key-by';

describe( 'keyBy', () => {
	test( 'should transform keys using a custom iteratee function', () => {
		const collection = [
			{ id: 1, name: 'Alice' },
			{ id: 2, name: 'Bob' },
			{ id: 3, name: 'Charlie' },
		];
		const result = keyBy( collection, ( item ) => `user_${ item.id }` );
		expect( result ).toEqual( {
			user_1: { id: 1, name: 'Alice' },
			user_2: { id: 2, name: 'Bob' },
			user_3: { id: 3, name: 'Charlie' },
		} );
	} );

	test( 'should use a property name shorthand as the iteratee', () => {
		const collection = [
			{ id: 'a', value: 10 },
			{ id: 'b', value: 20 },
			{ id: 'c', value: 30 },
		];
		const result = keyBy( collection, 'id' );
		expect( result ).toEqual( {
			a: { id: 'a', value: 10 },
			b: { id: 'b', value: 20 },
			c: { id: 'c', value: 30 },
		} );
	} );

	test( 'should handle inherited property names like constructor and hasOwnProperty as keys', () => {
		const collection = [
			{ type: 'constructor', val: 1 },
			{ type: 'hasOwnProperty', val: 2 },
			{ type: 'toString', val: 3 },
		];
		const result = keyBy( collection, 'type' );
		expect( result[ 'constructor' ] ).toEqual( { type: 'constructor', val: 1 } );
		expect( result[ 'hasOwnProperty' ] ).toEqual( { type: 'hasOwnProperty', val: 2 } );
		expect( result[ 'toString' ] ).toEqual( { type: 'toString', val: 3 } );
	} );

	test( 'should use a numeric index as the iteratee for arrays of arrays', () => {
		const collection = [
			[ 'apple', 'red' ],
			[ 'banana', 'yellow' ],
			[ 'grape', 'purple' ],
		];
		const result = keyBy( collection, 0 );
		expect( result ).toEqual( {
			apple: [ 'apple', 'red' ],
			banana: [ 'banana', 'yellow' ],
			grape: [ 'grape', 'purple' ],
		} );
	} );

	test( 'should accept an object as the collection input instead of an array', () => {
		const collection: { [ key: string ]: { id: string; score: number } } = {
			first: { id: 'x', score: 100 },
			second: { id: 'y', score: 200 },
			third: { id: 'z', score: 300 },
		};
		const result = keyBy( collection, 'id' );
		expect( result ).toEqual( {
			x: { id: 'x', score: 100 },
			y: { id: 'y', score: 200 },
			z: { id: 'z', score: 300 },
		} );
	} );
} );
