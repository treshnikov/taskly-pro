/** This method is used as a tradeoff when we need to place some class object to the redux store which doesn't allow to store instances of classes and other non serializable objects*/ 
export const convertToplainObj = (arg: object) => {
    return JSON.parse(JSON.stringify(arg))
}