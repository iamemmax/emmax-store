import bcrypt from 'bcrypt';

export const hashPassword = async (data: string) => {
    const genSalt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(data, genSalt)
    if (!hash) {
        console.log("unable to hash data");
    }
    return { hash } as const

}

export const verifyPassword = async (data: string, encryptedPass: string) => {
    const compared = await bcrypt.compare(data, encryptedPass)

    return { compared } as const
}