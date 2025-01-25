import { where } from "sequelize";

const GCPController = {
    // https://googleapis.dev/nodejs/billing/4.2.0/v1.CloudCatalogClient.html
    // https://github.com/googleapis/google-cloud-node/tree/main/packages/google-cloud-billing
    // WORKING SETUP, FOLLOW!
    // USE: https://cloudbilling.googleapis.com/v1/services/SERVICE_ID/skus?key=AIzaSyCxkVQzVRppjwwAKmJXoJPcHIE_bx1W81E 
    // USE: https://cloudbilling.googleapis.com/v2beta/services?key=AIzaSyCxkVQzVRppjwwAKmJXoJPcHIE_bx1W81E to get services ID or let user input them and show all skus for the service
    // the cost is untis + nanos (nanos are /1,000,000,000) i.e. unit = 1, 1 USD, nanos = 125000000 = .125, cost = 1.125$
    // dispaly cost = (unitprice * displayQuantity ) per displayQuantity usageUnit 
    // startUsageAmount of 10 indicates that the usage will be priced at the price defined above after the first 10 usage_units
    /**
     * @swagger
     * /GCP/{product_name}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Retrieve pricing details for a specific GCP product
     *     description: Fetches and formats pricing details, including tiered rates, for a given Google Cloud Platform product using the GCP billing API.
     *     tags: [GCP]
     *     parameters:
     *       - in: path
     *         name: product_name
     *         required: true
     *         description: The name or ID of the GCP product for which pricing details are requested.
     *         schema:
     *           type: string
     *           example: "0095-7665-C074"
     *         examples:
     *           example1:
     *             value: "0095-7665-C074"
     *             description: An example product ID.
     *           example2:
     *             value: "00C7-CE6D-B98F"
     *             description: Another example product ID.
     *           example3:
     *             value: "00E4-BD19-6904"
     *             description: A third example product ID.
     *           example4:
     *             value: "0042-8437-FF55"
     *             description: A fourth example product ID.
     *     responses:
     *       200:
     *         description: Successfully retrieved and formatted pricing details for the GCP product.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               additionalProperties:
     *                 type: object
     *                 properties:
     *                   name:
     *                     type: string
     *                     description: Display name of the service.
     *                   usageType:
     *                     type: string
     *                     description: The type of usage (e.g., OnDemand, Preemptible).
     *                   tier_1{j}:
     *                     type: string
     *                     description: Tiered pricing information for the product.
     *                     example: "For each 1 GB, with minimum start usage of 10 GB, price is 0.01 USD and is paid MONTHLY."
     *       500:
     *         description: Internal server error while fetching pricing details.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error retrieving product pricing details."
     */

    async getProductPrice(req, res) {
        try {
            //service_ID 
            const { product_name } = req.params
            //all skus for a selected service
            const request = await fetch(`https://cloudbilling.googleapis.com/v1/services/${product_name}/skus?key=${process.env.GCP_API_KEY}`)
            const jsonObj = await request.json()
            const skus = jsonObj.skus
            console.log(skus)
            var formattedSkus = {}
            //some skus have multiple tiers of price
            for (let i in skus) {
                formattedSkus = {
                    ...formattedSkus,
                    [`plan_${i}`]: {
                        name: `${skus[i].category.serviceDisplayName}, ${skus[i].description}`,
                        usageType: skus[i].category.usageType,
                    }
                }
                for (let j in skus[i].pricingInfo[0].pricingExpression.tieredRates) {
                    formattedSkus = {
                        ...formattedSkus,
                        [`plan_${i}`]: {
                            ...formattedSkus[`plan_${i}`],
                            [`tier_${j}`]: `for each ${skus[i].pricingInfo[0].pricingExpression.displayQuantity} ${skus[i].pricingInfo[0].pricingExpression.usageUnit}`
                                + `, with minimum start usage of ${skus[i].pricingInfo[0].pricingExpression.tieredRates[j].startUsageAmount} ${skus[i].pricingInfo[0].pricingExpression.usageUnit}`
                                + `, price is ${(skus[i].pricingInfo[0].pricingExpression.tieredRates[j].unitPrice.units + (skus[i].pricingInfo[0].pricingExpression.tieredRates[j].unitPrice.nanos / 100000000)) * skus[i].pricingInfo[0].pricingExpression.displayQuantity}`
                                + ` ${skus[i].pricingInfo[0].pricingExpression.tieredRates[j].unitPrice.currencyCode}.`
                        }
                    }
                }

            }

            return res.status(200).json(formattedSkus)

        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}
export default GCPController;