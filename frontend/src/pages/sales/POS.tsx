import React, { useEffect, useState } from 'react';
import { Sec_Heading, Section, Input } from '../../components/component';
import { Card, Col, Row ,ListGroup} from 'react-bootstrap';
import { DataService } from '../../hooks/hook'
import Select from 'react-select';

interface Searches { _id: string, sku: string, name: string, }
const POS = () => {
    const [customers, setscustomers] = useState([])
    const [warehouses, setWarehouses] = useState([])
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const [searchtimeout, settimeout] = useState<any>(null)
    const [searchResults, setsearchResults] = useState<Searches[]>([])
    const [searchedProducts, setsearchedProducts] = useState<any>([])

    const fetchDetails = async () => {
        const res1 = await DataService.get('/all/customers-details')
        const res2 = await DataService.get('/warehouses')
        const customers = res1.map((item: any) => ({ value: item._id, label: item.name }))
        const warehouses = res2.map((item: any) => ({ value: item._id, label: item.name }))
        setscustomers(customers), setWarehouses(warehouses)
    }

    const getSearchResults = async (searchVal: string) => {
        try {
            if (!searchVal) setsearchResults([]) // clear searchResults, previous Timeout & Abort signal
            if (searchtimeout && abortController) clearTimeout(searchtimeout), abortController.abort()
            const controller = new AbortController()

            const timeout = setTimeout(async () => {
                const res = await DataService.get(`/get-search-results/${searchVal}`, {}, controller.signal)
                const results = res.map((item: any) => ({ _id: item._id, sku: item.sku, name: item.title }))
                setsearchResults(results) // Calling Api & set Results
            }, 800)

            settimeout(timeout)
            setAbortController(controller)
        } catch (error: any) {
            if (error.name === "AbortError") console.log("Fetch request was aborted")
            console.error(error)
        }
    }

    const fetchProduct = async (id: string) => {
        const product: any = await DataService.get(`/product/${id}`)

        setsearchedProducts((prev_pro: any) => {
            const isDuplicate = prev_pro.some((pro: any) => pro._id === id) // Checking duplicate Products
            if (isDuplicate) return prev_pro // If duplicate, return unchanged array
            return [...prev_pro, { // Otherwise, add new user
                _id: product._id,
                product: product.title,
                current_stock: 0,
                qty: 1,
                tax: product.tax,
                cost: product.cost,
                // subtotal: getTaxonProduct(product.cost, product.tax, 1), // 1 for inital quantity
            }]
        })

        // settotal((prev: number) => {
        //     return prev += getTaxonProduct(product.cost, product.tax, 1)
        // })
        // set inital grand total
        setsearchResults([])
    }

    useEffect(() => { fetchDetails() }, [])
    return (
        <>
            <Sec_Heading page="POS" subtitle="Point of Sales" />
            <Section>
                <Col md='6'>
                    <Card>
                        <Card.Body>
                            <Row className='flex-column'>
                                <Col className='mb-3'>
                                    <div className={`inputForm`}>
                                        <Select
                                            // value={field.value || unitOption}
                                            isClearable
                                            isSearchable
                                            className='select'
                                            isRtl={false}
                                            placeholder='Select your customer'
                                            options={customers}
                                            // onChange={(selectedoption: any) => { setcustomerOption(selectedoption)}}
                                            styles={{ control: (style: any) => ({ ...style, boxShadow: 'none', border: 'none', }) }}
                                        />
                                    </div>
                                </Col>
                                <Col className='mb-2'>
                                    <div className={`inputForm`}>
                                        <Select
                                            // value={field.value || unitOption}
                                            isClearable
                                            isSearchable
                                            className='select'
                                            isRtl={false}
                                            placeholder='Select your warehouse'
                                            options={warehouses}
                                            // onChange={(selectedoption: any) => { setcustomerOption(selectedoption)}}
                                            styles={{ control: (style: any) => ({ ...style, boxShadow: 'none', border: 'none', }) }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md='6'>
                    <Card>
                        <Card.Body>
                            <Row className='flex-column'>
                                <Col className='mb-3'>
                                    <div className={`inputForm`}>
                                        <i className="fa-solid fa-magnifying-glass cusror-pointer"></i>
                                        <Input
                                            type="text"
                                            className="input"
                                            placeholder="Search Product by Code or Name"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => getSearchResults(e.target.value)}
                                        />
                                    </div>
                                </Col>
                                <Col className='position-relative'>
                                    <ListGroup className='position-absolute px-3 z-3 start-0 w-100' style={{ height: '100px' }}>
                                        {
                                            searchResults?.map(results => (
                                                <ListGroup.Item key={results._id} className='cusror-pointer w-100' onClick={() => {
                                                    // fetchProduct(results._id)
                                                }}>
                                                    <b className='me-3'>{results.sku}</b> {results.name}
                                                </ListGroup.Item>
                                            ))
                                        }
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Section>
        </>
    )
}
export default POS