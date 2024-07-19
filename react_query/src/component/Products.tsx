import { Fragment } from 'react/jsx-runtime'
import { useProduct, useProducts } from '../services/queries'
import { useState } from 'react'

const Products = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  )

  const productsQuery = useProducts()
  const productQuery = useProduct(selectedProductId)

  return (
    <>
      {productsQuery.data?.pages.map((group, i) => (
        <Fragment key={i}>
          {group.map((product) => (
            <Fragment key={product.id}>
              <button onClick={() => setSelectedProductId(product.id)}>
                {product.name}
              </button>
              <br />
            </Fragment>
          ))}
        </Fragment>
      ))}
      <br />
      <div>
        <button
          onClick={() => productsQuery.fetchNextPage()}
          disabled={!productsQuery.hasNextPage || productQuery.isFetching}
        >
          {productsQuery.isFetchingNextPage
            ? 'lOADING MORE... '
            : productsQuery.hasNextPage
            ? 'Load more'
            : 'Nothing more to load'}
        </button>
      </div>
      <div>Selected Product :</div>
      {JSON.stringify(productQuery.data)}
    </>
  )
}

export default Products
