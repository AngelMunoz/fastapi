import schema from 'fluent-json-schema';

const loginBody = schema
    .object()
    .prop('email', schema.string().format(schema.FORMATS.EMAIL).examples(['email@domain.com']).required())
    .prop('password', schema.string().required())

export const LoginSchema = {
    body: loginBody
}

const signupBody = schema
    .object()
    .prop('name', schema.string().minLength(1).maxLength(80).required())
    .prop('lastName', schema.string().minLength(1).maxLength(80).required())
    .prop('email', schema.string().format(schema.FORMATS.EMAIL).examples(['email@domain.com']).required())
    .prop('password',
        schema
            .string()
            .allOf([
                schema
                    .string()
                    .minLength(8)
                    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/)])
            .required())

export const SignUpSchema = {
    body: signupBody
}