

exports.createModel = async (Model, data, message) => {
    try {
        await Model.create(data);
        return {
            success: true,
            message
        };
    } catch (err) {
        return {
            success: false,
            message: err.message
        };
    }
};




exports.viewModel = async (Model) => {
    return await Model.find()
        .then((records) => ({
            success: true,
            records: records.length > 0 ? records : "No Records.."
        }))
        .catch(err => ({
            success: false,
            message: err.message
        }))
}




exports.trashModel = async (Model, id) => {

    const deleted = await Model.findByIdAndDelete(id)

    if (!deleted) {
        return {
            success: false,
            message: "Data Not Found..."
        }
    }

    return {
        success: true,
        message: "Successfully deleted..."

    }


}




exports.updateModel = async (Model, id, data, message) => {

    const updated = await Model.findByIdAndUpdate(id, data);

    if (!updated) {
        return {
            success: false,
            message: "Data Not Found..."
        };
    }

    return {
        success: true,
        message
    };


}



exports.viewPopulateModel = async (Model, populateId, selectOption) => {

    return await Model.find().populate({
        path: populateId,
        select: selectOption
    })
        .then((records) => ({
            success: true,
            records: records.length > 0 ? records : "No Records.."
        }))
        .catch(err => ({
            success: false,
            message: err.message
        }))
}




exports.viewMorePopulateModel = async (Model, populateId1, selectOption1, populateId2, selectOption2) => {

    return await Model.find({}, { __v: 0 })
        .populate({
            path: populateId1,
            select: selectOption1
        })
        .populate({
            path: populateId2,
            select: selectOption2
        })
        .then((records) => ({
            success: true,
            records: records.length > 0 ? records : "No Records"
        }))
        .catch(err => ({
            success: false,
            message: err.message
        }))

}




exports.existModel = async (Model, field, message) => {

     const records = await Model.findOne(field)

     if(records){
        return{
            success:true,
            records,
        }
     }else{
         return{
            success:false,
            message,
        }
     }


}




