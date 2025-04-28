import config from '../config/config'
class DataSerice {

    ClientAPI: string | undefined;
    constructor() {
        this.ClientAPI = config.serverURL;
    }

    async post(endURL: string, data: object, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(config.token_name)}`,
            ...(headers || {})
        }
        const res: Response = await fetch(`${this.ClientAPI}${endURL}`, {
            method: 'POST',
            headers: finalHeaders,
            body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Internal Server Error!')
        return await res.json()
    }

    async get(endURL: string, headers?: object, signal?: AbortSignal): Promise<any> {
        const finalHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(config.token_name)}`,
            ...(headers || {})
        }
        const res: Response = await fetch(`${this.ClientAPI}${endURL}`, {
            method: 'GET',
            headers: finalHeaders,
            signal: signal
        })
        if (!res.ok) throw new Error('Internal Server Error!')
        return await res.json()
    }

    async put(endURL: string, data: object, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(config.token_name)}`,
            ...(headers || {})
        }
        const res: Response = await fetch(`${this.ClientAPI}${endURL}`, {
            method: 'PUT',
            headers: finalHeaders,
            body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Internal Server Error!')
        return await res.json()
    }

    async patch(endURL: string, data?: object, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(config.token_name)}`,
            ...(headers || {})
        }
        const res: Response = await fetch(`${this.ClientAPI}${endURL}`, {
            method: 'PATCH',
            headers: finalHeaders,
            body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Internal Server Error!')
        return await res.json()
    }

    async delete(endURL: string, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(config.token_name)}`,
            ...(headers || {})
        }
        const res: Response = await fetch(`${this.ClientAPI}${endURL}`, {
            method: 'DELETE',
            headers: finalHeaders,
        })
        if (!res.ok) throw new Error('Internal Server Error!')
        return await res.json()
    }
}

export default new DataSerice