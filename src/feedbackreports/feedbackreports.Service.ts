import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {TSFeedbackReports, TIFeedbackReports, feedback_reports} from "../drizzle/schema"

export const  listFeedbackreportsService = async(limit?:number): Promise<TSFeedbackReports[]| null>=>{
    if(limit) {
        return await db.query.feedback_reports.findMany({
            limit:limit

        })
        
    }
    return db.query.feedback_reports.findMany()
}

export const getFeedbackreportsService = async(id: number): Promise<TIFeedbackReports|undefined>=>{
    return await db.query.feedback_reports.findFirst({
        where: (feedback_reports) => eq(feedback_reports.id, id)
        
    })
}

export const createFeedbackreportsService = async(feedback: TIFeedbackReports)=>{
    return await db.insert(feedback_reports).values(feedback)
    return "Feedback created"

}

export const updateFeedbackreportsService = async(id: number, feedback: Partial<TIFeedbackReports>)=>{
    return await db.update(feedback_reports).set(feedback).where(eq(feedback_reports.id, id))
    return "Feedback updated"
}

export const deleteFeedbackreportsService = async(id: number)=>{
    return await db.delete(feedback_reports).where(eq(feedback_reports.id, id))
    return "Feedback deleted"
}