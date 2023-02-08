import React, { useEffect, useState } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useProduct } from 'vtex.product-context'

const B2BProductContext = () => {
  const [getAval, setGetAval] = useState({})
  const { orderForm: { items } } = useOrderForm()
  const productContextValue = useProduct()

  const productId = productContextValue?.product?.items?.[0]?.itemId


  console.log("producto", productId, items)


  async function getAvailable() {
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          "items": [
            {
              "id": `${productId}`,
              "quantity": 1,
              "seller": "1"
            }
          ],
          "country": "BRA",
          "postalCode": "12345-000",
          "geoCoordinates": [
            -47.924747467041016
          ]
        }),
      }

      const res = fetch(`/api/checkout/pub/orderForms/simulation`, config)

      const aval = await (await res).json()

      console.log(aval, "aqui", aval.items[0].availability)

      let available = aval.items[0].availability

      if (available === 'cannotBeDelivered') {
        available = 'Not available'
      } else {
        return available
      }

      console.log(available)

      setGetAval(available)

    }
    useEffect(() => {
      getAvailable()
    }, [productId])


  return (
    <>
    <div>
      <p>Id: {productId}</p>
      <p>Availability: {JSON.stringify(getAval, null, 4)}</p>
    </div>
    </>
  )
}

export default B2BProductContext
