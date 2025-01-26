import pkg from '@aws-sdk/client-pricing';
const { PricingClient, GetProductsCommand, DescribeServicesCommand, GetAttributeValuesCommand } = pkg;

function convertRegionToLocation(region) {
    const regionMap = {
        'us-east-1': 'US East (N. Virginia)',
        'us-west-1': 'US West (N. California)',
        'us-west-2': 'US West (Oregon)',
        'eu-central-1': 'EU (Frankfurt)',
        'eu-west-1': 'EU (Ireland)',
        'ap-southeast-1': 'Asia Pacific (Singapore)',
        'ap-southeast-2': 'Asia Pacific (Sydney)',
        // Add more mappings as needed
    };
    return regionMap[region] || null;
}

const AWSController = {

    /**
     * @swagger
     * /aws/price:
     *   post:
     *     security:
     *       - bearerAuth: []
     *     summary: Retrieve the estimated price of an AWS resource
     *     description: Get the price per unit for a specific AWS resource based on its configuration.
     *     tags: [AWS Pricing]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               service_code:
     *                 type: string
     *                 description: The AWS service name (e.g., "AmazonEC2", "AmazonS3").
     *                 example: "AmazonEC2"
     *               config:
     *                 type: object
     *                 description: Configuration details for the resource.
     *                 properties:
     *                   region:
     *                     type: string
     *                     description: The AWS region code (e.g., "us-east-1").
     *                     example: "us-east-1"
     *                   instanceType:
     *                     type: string
     *                     description: The instance type for the resource (e.g., "t2.micro").
     *                     example: "t2.micro"
     *     responses:
     *       200:
     *         description: The estimated price per unit for the requested resource.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 service_code:
     *                   type: string
     *                   description: The AWS service name.
     *                 config:
     *                   type: object
     *                   description: The provided configuration details.
     *                   properties:
     *                     region:
     *                       type: string
     *                     instanceType:
     *                       type: string
     *                 unit:
     *                   type: string
     *                   description: The price unit.
     *                   example: "Hrs"
     *                 price_per_unit:
     *                   type: string
     *                   description: The price per unit in USD.
     *                   example: "0.0116"
     *                 description:
     *                   type: string
     *                   description: The descriptoin of the service and price.
     *                   example: "$0.0162 per Unused Reservation Windows t2.micro Instance Hour"
     *       500:
     *         description: API error while retrieving the resource price.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error fetching resource price"
     *                 error:
     *                   type: string
     *                   example: "No pricing data found for the given configuration."
     */
    async getServicePrice(req, res) {
        try {

            const { service_code, config } = req.body;
            const location = convertRegionToLocation(config.region);

            // Prepare filters based on the configuration
            const filters = Object.entries(config)
                .filter(([key, value]) => key !== 'region') // Exclude region as it's converted
                .map(([key, value]) => ({ Type: 'TERM_MATCH', Field: key, Value: value }));

            // Add the region/location filter
            if (location) {
                filters.push({ Type: 'TERM_MATCH', Field: 'location', Value: location });
            }

            const client = new PricingClient({ region: 'us-east-1' });
            const command = new GetProductsCommand({
                ServiceCode: service_code,
                Filters: filters,
            });

            const data = await client.send(command);

            if (data.PriceList.length === 0) {
                throw new Error('No pricing data found for the given configuration.');
            }

            // console.log(data.PriceList.length)

            // Extract the first hit price details
            const priceList = JSON.parse(data.PriceList[0]);
            // console.log(priceList)
            const onDemand = priceList.terms.OnDemand;
            const priceDimensions = Object.values(onDemand)[0].priceDimensions;
            // console.log(priceDimensions)
            const unit = Object.values(priceDimensions)[0].unit;
            const description = Object.values(priceDimensions)[0].description;
            const price_per_unit = Object.values(priceDimensions)[0].pricePerUnit.USD;

            return res.status(200).json({ service_code, config, unit, price_per_unit, description });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching resource price", error: error.message });
        }
    },

    /**
     * @swagger
     * /aws/service/{service_code}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Retrieve the available filters for a given AWS service
     *     description: Get the available configuration filters (like instanceType, location) for a specific AWS service.
     *     tags: [AWS Pricing]
     *     parameters:
     *       - in: path
     *         name: service_code
     *         required: true
     *         description: The AWS service code (e.g., "AmazonEC2", "AmazonS3").
     *         schema:
     *           type: string
     *           example: "AmazonEC2"
     *     responses:
     *       200:
     *         description: The available filters for the specified service.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 service_code:
     *                   type: string
     *                   description: The AWS service code.
     *                 filters:
     *                   type: array
     *                   description: List of available filters for the service.
     *                   items:
     *                     type: object
     *                     properties:
     *                       Key:
     *                         type: string
     *                         description: The name of the filter.
     *                       Values:
     *                         type: array
     *                         description: The possible values for the filter.
     *                         items:
     *                           type: string
     *       500:
     *         description: API error while retrieving service filters.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error fetching service filters"
     *                 error:
     *                   type: string
     *                   example: "Service not found"
     */
    async getServiceConfigs(req, res) {
        try {

            const service_code = req.params.service_code;

            const client = new PricingClient({ region: 'us-east-1' });

            // Get the service details for the given service code
            const command = new DescribeServicesCommand({ServiceCode: service_code});
            const data = await client.send(command);

            if (!data) {
                throw new Error('Service not found');
            }

            // Retrieve the configs associated with this service
            const configs = data.Services[0].AttributeNames;
            return res.status(200).json(configs);

        } catch (error) {
            return res.status(500).json({ message: "Error fetching service filters:", error });
        }
    },

    /**
     * @swagger
     * /aws/service/{service_code}/{config_name}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     summary: Retrieve the possible values for a specific configuration filter of an AWS service
     *     description: Get the available values for a specific configuration filter (like instanceType) for a given AWS service.
     *     tags: [AWS Pricing]
     *     parameters:
     *       - in: path
     *         name: service_code
     *         required: true
     *         description: The AWS service code (e.g., "AmazonEC2", "AmazonS3").
     *         schema:
     *           type: string
     *           example: "AmazonEC2"
     *       - in: path
     *         name: config_name
     *         required: true
     *         description: The filter key (e.g., "instanceType", "location").
     *         schema:
     *           type: string
     *           example: "instanceType"
     *     responses:
     *       200:
     *         description: The possible values for the specified filter key.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: string
     *                 description: The possible values for the filter key.
     *       500:
     *         description: API error while retrieving configuration values.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Error fetching configuration values"
     *                 error:
     *                   type: string
     *                   example: "Configuration filter not found"
     */
    async getConfigurationValues(req, res) {
        try {

            const { service_code, config_name } = req.params;

            const client = new PricingClient({ region: 'us-east-1' });

            const command = new GetAttributeValuesCommand({ServiceCode: service_code, AttributeName: config_name}); 
            const data = await client.send(command);

            if (!data.AttributeValues || data.AttributeValues.length === 0) {
                throw new Error('Configuration filter not found');
            }

            //configValues = data.AttributeValues;
            const configValues = data.AttributeValues.map(attr => attr.Value);

            // Return the possible values for the filter
            return res.status(200).json(configValues);

        } catch (error) {
            return res.status(500).json({ message: "Error fetching configuration values:", error });
        }
    }
}

export default AWSController;

