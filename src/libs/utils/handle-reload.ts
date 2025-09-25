export const handleUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault()
    event.returnValue = ''
}
