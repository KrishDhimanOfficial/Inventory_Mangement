import Big from "big.js"
import useFetchData from "./useFetchData";
import useDeleteData from "./useDeleteData";
import Notify from "./Notify";
import DataService from "./DataService";
import { downloadCSV, generatePDF, filterData } from "./datatable";

/**  Calculators */
const getDiscount = (discount = 0, total: number) => parseFloat((total * discount / 100).toFixed(2))
const getorderTax = (tax = 0, total: number) => parseFloat(Big(total * tax / 100).toFixed(2))
const handelvalToNotbeNegitive = (val: number) => val > 0 ? val : 0;
const handleqtytonotbeNegitive = (product: any) => {
    return product.qty || product.qtyreturn <= 0
        ? 0
        : product.qty || product.qtyreturn - 1  // qtyreturn check on purchase & sales Return
}// this will check qty should not be less than Zero
const getTaxonProduct = (productCost: number, tax: number, qty: number) => {
    return parseFloat(Big(productCost * tax / 100).plus(productCost).mul(qty).toFixed(2))
    // this will add a tax on product
}
/**  Calculators */

export {
    useFetchData,
    useDeleteData,
    Notify,
    DataService,
    downloadCSV,
    generatePDF,
    filterData,
    handleqtytonotbeNegitive,
    getDiscount,
    getTaxonProduct,
    getorderTax,
    handelvalToNotbeNegitive
}