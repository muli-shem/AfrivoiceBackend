CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" varchar(100) NOT NULL,
	"record_id" integer NOT NULL,
	"action" varchar(50) NOT NULL,
	"old_data" text,
	"new_data" text,
	"user_id" integer,
	"created_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer,
	"user_id" integer,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "educational_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"created_by" integer,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedback_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"evidence_url" varchar(255) NOT NULL,
	"reported_by" integer,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "government_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"responsible_officer" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'ongoing',
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"county" varchar(50) NOT NULL,
	"sub_county" varchar(50) NOT NULL,
	"ward" varchar(50) NOT NULL,
	"budget" integer NOT NULL,
	"progress_percentage" integer DEFAULT 0,
	"media_url" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leader_communications" (
	"id" serial PRIMARY KEY NOT NULL,
	"leader_id" integer,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"target_county" varchar(50) NOT NULL,
	"target_sub_county" varchar(50) NOT NULL,
	"target_ward" varchar(50) NOT NULL,
	"is_national" boolean DEFAULT false,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL,
	"status" varchar(50) DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leaders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"position" varchar(50) NOT NULL,
	"county" varchar(50) NOT NULL,
	"sub_county" varchar(50) NOT NULL,
	"ward" varchar(50) NOT NULL,
	"manifesto" text NOT NULL,
	"photo_url" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_url" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"uploaded_by" integer,
	"leader_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"user_id" integer,
	"media_file_id" integer NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"role_id" integer,
	"assigned_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" varchar(256) NOT NULL,
	"profile_photo" varchar(255) NOT NULL,
	"location" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "educational_content" ADD CONSTRAINT "educational_content_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback_reports" ADD CONSTRAINT "feedback_reports_reported_by_users_id_fk" FOREIGN KEY ("reported_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leader_communications" ADD CONSTRAINT "leader_communications_leader_id_leaders_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."leaders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_files" ADD CONSTRAINT "media_files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_files" ADD CONSTRAINT "media_files_leader_id_leaders_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."leaders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_files" ADD CONSTRAINT "media_files_project_id_government_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."government_projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_media_file_id_media_files_id_fk" FOREIGN KEY ("media_file_id") REFERENCES "public"."media_files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
