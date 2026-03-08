import RetailerResponseDTO from "../models/RetailerResponseDTO.js";
import {
  getAllRetailers,
  getRetailerById,
} from "../repository/RetailerRepository.js";

const retrieveAllRetailers = async () => {
  const retailers = await getAllRetailers(); // this is an array

  // map each retailer to a DTO
  const response = retailers.map(
    (retailer) =>
      new RetailerResponseDTO(
        retailer.retailerId,
        retailer.retailerName,
        retailer.retailerURL,
        retailer.retailerLogoUrl,
      ),
  );

  return response;
};

const retrieveRetailerById = async (retailerId) => {
  const retailer = await getRetailerById(retailerId);

  const response = new RetailerResponseDTO(
    retailer.retailerId,
    retailer.retailerName,
    retailer.retailerURL,
    retailer.retailerLogoUrl,
  );

  return response;
};

export { retrieveAllRetailers, retrieveRetailerById };
