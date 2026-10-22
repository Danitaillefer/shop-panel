export const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
})

export const currencyFormatter = new Intl.NumberFormat('es-ES',{
    style:'currency',
    currency: 'EUR'
})

export const shortDateFormatter = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC'
})