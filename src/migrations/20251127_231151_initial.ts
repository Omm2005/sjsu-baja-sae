import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_page_sponsor_tab_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar
  );
  
  CREATE TABLE "contact_page_join_tab_meetings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"time" varchar NOT NULL,
  	"location" varchar NOT NULL
  );
  
  CREATE TABLE "contact_page_join_tab_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_intro" varchar NOT NULL,
  	"team_email" varchar NOT NULL,
  	"sponsor_tab_label" varchar NOT NULL,
  	"sponsor_tab_description" varchar NOT NULL,
  	"sponsor_tab_form_heading" varchar NOT NULL,
  	"sponsor_tab_form_subtitle" varchar NOT NULL,
  	"join_tab_label" varchar NOT NULL,
  	"join_tab_description" varchar NOT NULL,
  	"join_tab_form_heading" varchar NOT NULL,
  	"join_tab_form_subtitle" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE "gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"order_rank" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sponsor" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"alt" varchar,
  	"website" varchar,
  	"order_rank" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_member" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt" varchar,
  	"role" varchar,
  	"order_rank" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Who are we?' NOT NULL,
  	"description" varchar NOT NULL,
  	"link_text" varchar DEFAULT 'Learn More' NOT NULL,
  	"link_page_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "about_page_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_page_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "gallery_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sponsor_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_member_id" integer;
  ALTER TABLE "contact_page_sponsor_tab_highlights" ADD CONSTRAINT "contact_page_sponsor_tab_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_join_tab_meetings" ADD CONSTRAINT "contact_page_join_tab_meetings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_join_tab_highlights" ADD CONSTRAINT "contact_page_join_tab_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sponsor" ADD CONSTRAINT "sponsor_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_member" ADD CONSTRAINT "team_member_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_about" ADD CONSTRAINT "home_about_link_page_id_about_page_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."about_page"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "about_page_slug_idx" ON "about_page" USING btree ("slug");
  CREATE INDEX "about_page_updated_at_idx" ON "about_page" USING btree ("updated_at");
  CREATE INDEX "about_page_created_at_idx" ON "about_page" USING btree ("created_at");
  CREATE INDEX "contact_page_sponsor_tab_highlights_order_idx" ON "contact_page_sponsor_tab_highlights" USING btree ("_order");
  CREATE INDEX "contact_page_sponsor_tab_highlights_parent_id_idx" ON "contact_page_sponsor_tab_highlights" USING btree ("_parent_id");
  CREATE INDEX "contact_page_join_tab_meetings_order_idx" ON "contact_page_join_tab_meetings" USING btree ("_order");
  CREATE INDEX "contact_page_join_tab_meetings_parent_id_idx" ON "contact_page_join_tab_meetings" USING btree ("_parent_id");
  CREATE INDEX "contact_page_join_tab_highlights_order_idx" ON "contact_page_join_tab_highlights" USING btree ("_order");
  CREATE INDEX "contact_page_join_tab_highlights_parent_id_idx" ON "contact_page_join_tab_highlights" USING btree ("_parent_id");
  CREATE INDEX "contact_page_updated_at_idx" ON "contact_page" USING btree ("updated_at");
  CREATE INDEX "contact_page_created_at_idx" ON "contact_page" USING btree ("created_at");
  CREATE INDEX "gallery_images_order_idx" ON "gallery_images" USING btree ("_order");
  CREATE INDEX "gallery_images_parent_id_idx" ON "gallery_images" USING btree ("_parent_id");
  CREATE INDEX "gallery_images_image_idx" ON "gallery_images" USING btree ("image_id");
  CREATE INDEX "gallery_updated_at_idx" ON "gallery" USING btree ("updated_at");
  CREATE INDEX "gallery_created_at_idx" ON "gallery" USING btree ("created_at");
  CREATE INDEX "sponsor_logo_idx" ON "sponsor" USING btree ("logo_id");
  CREATE INDEX "sponsor_updated_at_idx" ON "sponsor" USING btree ("updated_at");
  CREATE INDEX "sponsor_created_at_idx" ON "sponsor" USING btree ("created_at");
  CREATE INDEX "team_member_image_idx" ON "team_member" USING btree ("image_id");
  CREATE INDEX "team_member_updated_at_idx" ON "team_member" USING btree ("updated_at");
  CREATE INDEX "team_member_created_at_idx" ON "team_member" USING btree ("created_at");
  CREATE INDEX "home_about_link_page_idx" ON "home_about" USING btree ("link_page_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_about_page_fk" FOREIGN KEY ("about_page_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_page_fk" FOREIGN KEY ("contact_page_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsor_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_member_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_member"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_about_page_id_idx" ON "payload_locked_documents_rels" USING btree ("about_page_id");
  CREATE INDEX "payload_locked_documents_rels_contact_page_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_page_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_id");
  CREATE INDEX "payload_locked_documents_rels_sponsor_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsor_id");
  CREATE INDEX "payload_locked_documents_rels_team_member_id_idx" ON "payload_locked_documents_rels" USING btree ("team_member_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_sponsor_tab_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_join_tab_meetings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_join_tab_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sponsor" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_member" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_about" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "contact_page_sponsor_tab_highlights" CASCADE;
  DROP TABLE "contact_page_join_tab_meetings" CASCADE;
  DROP TABLE "contact_page_join_tab_highlights" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "gallery_images" CASCADE;
  DROP TABLE "gallery" CASCADE;
  DROP TABLE "sponsor" CASCADE;
  DROP TABLE "team_member" CASCADE;
  DROP TABLE "home_about" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_about_page_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_page_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_gallery_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sponsor_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_member_fk";
  
  DROP INDEX "payload_locked_documents_rels_about_page_id_idx";
  DROP INDEX "payload_locked_documents_rels_contact_page_id_idx";
  DROP INDEX "payload_locked_documents_rels_gallery_id_idx";
  DROP INDEX "payload_locked_documents_rels_sponsor_id_idx";
  DROP INDEX "payload_locked_documents_rels_team_member_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "about_page_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_page_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "gallery_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sponsor_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_member_id";`)
}
