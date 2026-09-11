import Joi from 'joi';

const driverSchema = Joi.object({
  name: Joi.string().min(3).required(),
  team: Joi.string().min(3).required(),
  points: Joi.number().min(0).max(1000).default(0),
}).required();

const updateDriverSchema = Joi.object({
  name: Joi.string().min(3),
  team: Joi.string().min(3),
  points: Joi.number().min(0).max(1000),
}).min(1).required();

function generatePositionSchema(array) {
  return Joi.number().min(1).max(array.length);
}

function validation(schema){
    return function (info){
        return schema.validate(info, { abortEarly: false });
    }
}

export const validateDriverInfo = validation(driverSchema);
export const validateUpdateDriverInfo = validation(updateDriverSchema);
export const validatePosition = (array, info) => generatePositionSchema(array).validate(info);