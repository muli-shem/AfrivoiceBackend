import { pgTable, serial, varchar, text, integer,pgEnum, timestamp, boolean, foreignKey, date } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
// Enum for user roles
export const roleEnum = pgEnum("role", ["admin", "leader", "citizen"]);

// Users Table: Stores all user-related information
export const users = pgTable('users', {
  id: serial('id').primaryKey(), // Unique identifier for each user
  username: varchar('username', { length: 50 }).notNull().unique(), // Username of the user
  email: varchar('email', { length: 100 }).notNull().unique(), // Email address of the user
  password_hash: varchar('password_hash', { length: 256 }).notNull(), // Hashed password for secure authentication
  profile_photo: varchar('profile_photo', { length: 255 }), // Profile photo URL
  county: varchar('county', { length: 50 }).notNull(), // County that the of user
  sub_county: varchar('sub_county', { length: 50 }).notNull(), // Sub-county of user
  ward: varchar('ward', { length: 50 }).notNull(), // Ward of user
  role:varchar('role').default('citizen').notNull(),
  reset_token: text("reset_token"), // Add this field
    reset_token_expiration: timestamp("reset_token_expiration"), // Add this field
  created_at: timestamp('created_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the user was created
  updated_at: timestamp('updated_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the user was last updated
});

// Leaders Table: Stores information about various leaders
export const leaders = pgTable('leaders', {
  id: serial('id').primaryKey(), // Unique identifier for each leader
  user_id: integer('user_id').references(() => users.id, { onDelete: "cascade" }).notNull(), // Foreign key referencing the users table
  name: varchar('name', { length: 100 }).notNull(), // Full name of the leader
  position: varchar('position', { length: 50 }).notNull(), // Position of the leader (e.g., MCA, Governor, Senator)
  manifesto: text('manifesto').notNull(), // Leader's manifesto
  photo_url: varchar('photo_url', { length: 255 }), // URL to the leader's profile photo
  created_at: timestamp('created_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the leader was added
  updated_at: timestamp('updated_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the leader was last updated
});


// Leader Communications Table: Stores messages and announcements from leaders to their constituents
export const leader_communications = pgTable('leader_communications', {
  id: serial('id').primaryKey(), // Unique identifier for each communication
  leader_id: integer('leader_id').references(() => leaders.id, {onDelete:"cascade"}), // Foreign key referencing the leader
  title: varchar('title', { length: 255 }).notNull(), // Title of the communication
  message: text('message').notNull(), // Detailed message content
  target_county: varchar('target_county', { length: 50 }).notNull(), // County targeted by the communication
  target_sub_county: varchar('target_sub_county', { length: 50 }).notNull(), // Sub-county targeted by the communication
  target_ward: varchar('target_ward', { length: 50 }).notNull(), // Ward targeted by the communication
  is_national: boolean('is_national').default(false), // Flag to indicate if the communication is for the entire nation
  created_at: timestamp('created_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the communication was created
  updated_at: timestamp('updated_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the communication was last updated
  status: varchar('status', { length: 50 }).default('active'), // Status of the communication (e.g., active, archived)
});

// Government Projects Table: Stores information about government projects
export const government_projects = pgTable('government_projects', {
  id: serial('id').primaryKey(), // Unique identifier for each project
  title: varchar('title', { length: 255 }).notNull(), // Title of the project
  description: text('description').notNull(), // Detailed description of the project
  responsible_officer: varchar('responsible_officer', { length: 100 }).notNull(), // Officer or department responsible for the project
  status: varchar('status', { length: 50 }).default('ongoing'), // Current status of the project (e.g., ongoing, completed, stalled)
  start_date: date('start_date').notNull(), // Project start date
  end_date: date('end_date').notNull(), // Project end date (if applicable)
  county: varchar('county', { length: 50 }).notNull(), // County where the project is taking place
  sub_county: varchar('sub_county', { length: 50 }).notNull(), // Sub-county where the project is located
  ward: varchar('ward', { length: 50 }).notNull(), // Ward where the project is located
  budget: integer('budget').notNull(), // Budget allocated for the project
  progress_percentage: integer('progress_percentage').default(0), // Progress of the project in percentage
  media_url: varchar('media_url', { length: 255 }), // URL for project-related media (e.g., photos, videos)
  created_at: timestamp('created_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the project was posted
  updated_at: timestamp('updated_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the project was last updated
});

// Media Files Table: Stores media files uploaded by users or leaders
export const media_files = pgTable('media_files', {
  id: serial('id').primaryKey(), // Unique identifier for each media file
  file_url: varchar('file_url', { length: 255 }).notNull(), // URL of the media file
  file_type: varchar('file_type', { length: 50 }).notNull(), // Type of the file (e.g., image, video)
  uploaded_by: integer('uploaded_by').references(() => users.id, {onDelete:"cascade"}), // User who uploaded the media
  leader_id: integer('leader_id').references(() => leaders.id, {onDelete:"cascade"}).notNull(), // Optional foreign key referencing the leader
  project_id: integer('project_id').references(() => government_projects.id, {onDelete:"cascade"}).notNull(), // Optional foreign key referencing the project
  created_at: timestamp('created_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the media file was uploaded
});

// Feedback Reports Table: Stores reports of corruption or misconduct
export const feedback_reports = pgTable('feedback_reports', {
  id: serial('id').primaryKey(), // Unique identifier for each report
  title: varchar('title', { length: 255 }).notNull(), // Title of the report
  description: text('description').notNull(), // Detailed description of the issue
  evidence_url: varchar('evidence_url', { length: 255 }), // URL for evidence (e.g., images, videos)
  reported_by: integer('reported_by').references(() => users.id, {onDelete:"cascade"}), // User who reported the issue
  project_id: integer('project_id').references(() => government_projects.id, { onDelete: "cascade" }).notNull(), // Associate comment with a project
  status: varchar('status', { length: 50 }).default('pending'), // Status of the report (e.g., pending, reviewed, resolved)
  created_at: timestamp('created_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the report was created
  updated_at: timestamp('updated_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the report was last updated
});

// Educational Content Table: Stores educational materials related to constitutional rights
export const educational_content = pgTable('educational_content', {
  id: serial('id').primaryKey(), // Unique identifier for each educational material
  title: varchar('title', { length: 255 }).notNull(), // Title of the content
  content: text('content').notNull(), // Detailed content
  image_url: varchar('image_url', { length: 255 }), // URL for images related to the content
  content_type: varchar('content_type', { length: 50 }).notNull(), // Type of content (e.g., article, video, infographic)
  created_by: integer('created_by').references(() => users.id, {onDelete:"cascade"}), // User or admin who created the content
  created_at: timestamp('created_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the content was created
  updated_at: timestamp('updated_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the content was last updated
});

// Posts Table: Stores posts made by users about leaders and projects
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(), // Unique identifier for each post
  title: varchar('title', { length: 255 }).notNull(), // Title of the post
  content: text('content').notNull(), // Content of the post
  user_id: integer('user_id').references(() => users.id, {onDelete:"cascade"}), // User who made the post
  media_file_id: integer('media_file_id').references(() => media_files.id, {onDelete:"cascade"}).notNull(), // Optional foreign key referencing media
  created_at: timestamp('created_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the post was created
  updated_at: timestamp('updated_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the post was last updated
});

// Comments Table: Stores comments on posts
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(), // Unique identifier for each comment
  user_id: integer('user_id').references(() => users.id, {onDelete:"cascade"}), // User who made the comment
  project_id: integer('project_id').references(() => government_projects.id, { onDelete: "cascade" }).notNull(), // Associate comment with a project
  content: text('content').notNull(), // Content of the comment
  created_at: timestamp('created_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the comment was created
  updated_at: timestamp('updated_at').defaultNow().default(sql`NOW()`).notNull(), // Timestamp for when the comment was last updated
});

// Audit Logs Table: Tracks changes to key tables like leaders and projects
export const audit_logs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  table_name: varchar('table_name', { length: 100 }).notNull(), // Name of the table that was modified
  record_id: integer('record_id').notNull(), // ID of the record that was modified
  action: varchar('action', { length: 50 }).notNull(), // Type of action (e.g., insert, update, delete)
  old_data: text('old_data'), // Optional: Previous state of the record
  new_data: text('new_data'), // Optional: New state of the record
  user_id: integer('user_id').references(() => users.id), // User who made the change
  created_at: timestamp('created_at').defaultNow().default(sql`NOW()`).notNull(),
});
export const auth_table = pgTable('auth_table', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp('created_at').defaultNow().default(sql`NOW()`).notNull(),
  updated_at: timestamp('updated_at').defaultNow().default(sql`NOW()`).notNull(),

});
// relationships 

export const userRelationships = relations(users,({one, many}) =>({
  media_files:one(media_files,{ // one to one relationship
    fields:[users.id],
    references: [media_files.uploaded_by]
  })
  ,posts:many(posts) // one to many relationship
  ,comments:many(comments) // one to many relationship
 
}));
export const usersRelationships = relations(users,({one, many}) =>({
 auth_tabble:one(auth_table,{
    fields:[users.id],
    references:[auth_table.user_id]
  }),
  leader_communications:many(leader_communications), // one to many relationship
  audit_logs:many(audit_logs), // one to many relationship
}));

export const userfeedbackRelationships = relations(users,({one,many})=>({
  feedback_reports:one(feedback_reports,{
    fields:[users.id],
    references:[feedback_reports.id]
  }),
  media_files:one(media_files,{
    fields:[users.id],
    references:[media_files.uploaded_by]
  })

}))

export const usereducational_contentRelationships = relations(users, ({one,many})=>({
  educational_content:one(educational_content,{
    fields: [users.id],
    references:[educational_content.id]
  }),
  media_files:one(media_files,{
    fields:[users.id],
    references:[media_files.uploaded_by]
  }),
  posts:one(posts,{
    fields:[users.id],
    references:[posts.user_id]
  }),
  comments:one(comments,{
    fields:[users.id],
    references:[comments.user_id]
  }),
  audit_logs:one(audit_logs,{
    fields:[users.id],
    references:[audit_logs.user_id]
  }),
  feedback_reports:one(feedback_reports,{
    fields:[users.id],
    references:[feedback_reports.id]
  }),
  leader_communications:one(leader_communications,{
    fields:[users.id],
    references:[leader_communications.id]
  })

}))


export const leader_communicationsRelationships = relations(leaders,({one, many})=>({
  leader_communications:one(leader_communications,{
    fields:[leaders.id],
    references:[leader_communications.id]
  })
}))

export const media_filesLeadeRelationships = relations(leaders, ({one, many})=>({
  media_files: one(media_files,{
   fields:[leaders.id],
    references:[media_files.leader_id] 
  }),
  leader_communications: one(leader_communications,{
    fields:[leaders.id],
    references:[leader_communications.id]
  }),
  feedback_reports: one(feedback_reports,{
    fields:[leaders.id],
    references:[feedback_reports.id]
  }),
  audit_logs: one(audit_logs,{
    fields:[leaders.id],
    references:[audit_logs.user_id]
  }),
  educational_content: one(educational_content,{
    fields:[leaders.id],
    references:[educational_content.created_by]
  }),
}))

export const usercommentsRelationships = relations(users,({one, many})=>({
  comments:one(comments,{
  fields:[users.id],
   references:[comments.user_id]  
  }),
  posts:one(posts,{
    fields:[users.id],
    references:[posts.user_id]// one to one relationship
  })
}))
// Example: Leader Audit Log relationship
export const leaderAuditLogRelationships = relations(leaders, ({ one, many }) => ({
  audit_logs: one(audit_logs, {
    fields: [leaders.id],
    references: [audit_logs.record_id]
  })
}));




export type TIUsers = typeof users.$inferInsert;
export type TSUsers = typeof users.$inferSelect;
export type TILeaders = typeof leaders.$inferInsert;
export type TSLeaders = typeof leaders.$inferSelect;
export type TILeadcomm = typeof leader_communications.$inferInsert;
export type TSLeadcomm = typeof leader_communications.$inferSelect;
export type TSProjects = typeof government_projects.$inferSelect;
export type TIProjects = typeof government_projects.$inferInsert;
export type TIMediafiles = typeof media_files.$inferInsert;
export type TSMediafiles = typeof media_files.$inferSelect;
export type TIFeedbackReports= typeof feedback_reports.$inferInsert;
export type TSFeedbackReports = typeof feedback_reports.$inferSelect;
export type TIPosts = typeof posts.$inferInsert;
export type TSPosts = typeof posts.$inferSelect;
export type TIEducation = typeof educational_content.$inferInsert;
export type TSEducation = typeof educational_content.$inferSelect;
export type TSCommentReports = typeof comments.$inferSelect;
export type TICommentReports = typeof comments.$inferInsert;