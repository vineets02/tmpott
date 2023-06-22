import contentTypeModel from "../models/contentTypeModel.js"
import slugify from "slugify"
export const createContentTypeController = async (req, res) => {
  try {
    const { contenttype } = req.body
    if (!contenttype) {
      return res.status(401).send({ message: "Content type is required" })
    }
    const existingContentType = await contentTypeModel.findOne({ contenttype })
    if (existingContentType) {
      return res.status(200).send({
        success: true,
        message: "content type Already Exisits",
      })
    }
    const contentType = await new contentTypeModel({
      contenttype,
      slug: slugify(contenttype),
    }).save()
    res.status(201).send({
      success: true,
      message: "new contenttype created",
      contentType,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Errro in contenttype",
    })
  }
}

//update category
export const updateContentTypeController = async (req, res) => {
  try {
    const { contenttype } = req.body
    const { id } = req.params
    const contentType = await contentTypeModel.findByIdAndUpdate(
      id,
      { contenttype, slug: slugify(contenttype) },
      { new: true }
    )
    res.status(200).send({
      success: true,
      messsage: "contenttype Updated Successfully",
      contentType,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating contentType",
    })
  }
}

// get all cat
export const contenttypeControlller = async (req, res) => {
  try {
    const contenttype = await contentTypeModel.find({})
    res.status(200).send({
      success: true,
      message: "All contenttype List",
      contenttype,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all contenttype",
    })
  }
}

// single category
export const singleContentTypeController = async (req, res) => {
  try {
    const contenttype = await contentTypeModel.findOne({
      slug: req.params.slug,
    })
    res.status(200).send({
      success: true,
      message: "Get SIngle contenttype SUccessfully",
      contenttype,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single contenttype",
    })
  }
}

//delete category
export const deleteContentTypeCOntroller = async (req, res) => {
  try {
    const { id } = req.params
    await contentTypeModel.findByIdAndDelete(id)
    res.status(200).send({
      success: true,
      message: "contenttype Deleted Successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error while deleting contenttype",
      error,
    })
  }
}
