const AzureController = {

    async fetchResourcePrice(req,res){
/**
 * @swagger
 * /azure:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Fetch resource price
 *     description: Fetch resource prices based on the provided service details.
 *     tags: [Azure]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceFamily
 *               - serviceName
 *               - skuName
 *               - location
 *             properties:
 *               serviceFamily:
 *                 type: string
 *                 description: The family of the Azure service.
 *                 example: Compute
 *               serviceName:
 *                 type: string
 *                 description: The name of the Azure service.
 *                 example: Virtual Machines
 *               productName:
 *                 type: string
 *                 description: The product name, including OS type, if applicable.
 *                 example: Virtual Machines DSv2 Series Windows
 *               skuName:
 *                 type: string
 *                 description: The SKU tier of the Azure resource.
 *                 example: DS1 v2
 *               location:
 *                 type: string
 *                 description: The location or region for the resource.
 *                 example: US East
 *               type:
 *                 type: string
 *                 description: The pricing model for the resource.
 *                 example: Consumption
 *               currencyCode:
 *                 type: string
 *                 description: The currency of the resource. Accepts ISO 4217 codes.
 *                 example: USD
 *           examples:
 *             Virtual Machine:
 *               value:
 *                 serviceFamily: Compute
 *                 serviceName: Virtual Machines
 *                 skuName: DS1 v2
 *                 location: US East
 *                 type: Consumption
*             IP Address:
 *               value:
 *                 serviceFamily: Networking
 *                 serviceName: Virtual Network
 *                 ProductName: IP Addresses
 *                 skuName: Basic
 *                 location: US East
 *                 type: DevTestConsumption
 *             Blob Storage:
 *               value:
 *                 serviceFamily: Storage
 *                 ProductName: Blob Storage
 *                 skuName: Cool LRS
 *                 location: US East
 *                 type: Consumption
 *             OS Disk:
 *               value:
 *                 serviceFamily: Storage
 *                 serviceName: Storage
 *                 productName: Premium SSD Managed Disks
 *                 skuName: P3 LRS
 *                 location: US East
 *                 type: Consumption
 *             Managed Disk:
 *               value:
 *                 serviceFamily: Storage
 *                 serviceName: Storage
 *                 productName: Standard SSD Managed Disks
 *                 skuName: E80 LRS
 *                 location: US East
 *                 type: Consumption
 
 *     responses:
 *       200:
 *         description: Resource price fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetched resource price
 *                 data:
 *                   type: object
 *                   example:
 *                     {
 *                       "currencyCode": "USD",
 *                       "tierMinimumUnits": 0.0,
 *                       "retailPrice": 0.002,
 *                       "unitPrice": 0.002,
 *                       "armRegionName": "eastus",
 *                       "location": "US East",
 *                       "effectiveStartDate": "2018-11-01T00:00:00Z",
 *                       "meterId": "ce957933-8287-4f8b-83ee-53a5cbe056d9",
 *                       "meterName": "E80 LRS Disk Operations",
 *                       "productId": "DZH318Z0BP88",
 *                       "skuId": "DZH318Z0BP88/006D",
 *                       "productName": "Standard SSD Managed Disks",
 *                       "skuName": "E80 LRS",
 *                       "serviceName": "Storage",
 *                       "serviceFamily": "Storage",
 *                       "unitOfMeasure": "10K",
 *                       "type": "Consumption",
 *                       "isPrimaryMeterRegion": false,
 *                       "armSkuName": ""
 *                     }
 *       400:
 *         description: Bad request. Required parameters are missing or invalid.
 *       500:
 *         description: Server error while fetching the resource price.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching prices
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */

        try {
            // Build params based on odata specs
            const ResourceConfig = req.body;
            const RequestParams = Object.entries(ResourceConfig)
            .map(([key, value]) => `${key} eq '${value}'`)
            .join(' and ');

            // Send the request to Azure
            const ApiUrl="https://prices.azure.com/api/retail/prices?$filter=".concat(RequestParams);
            let ResourceDetails = await fetch(ApiUrl);
            ResourceDetails = await ResourceDetails.json();

            // Return the response
            return res.status(200).json(ResourceDetails);
        } catch (error){
            return res.status(500).json({ message: "Error fetching prices", error: error.message });
        }
    }
}

export default AzureController;

