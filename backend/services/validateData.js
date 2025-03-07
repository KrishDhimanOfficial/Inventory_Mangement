const validate = (res, error) => {
    const errors = Object.values(error).map((err) => err.message)
    return res.json({ errors })
}
export default validate