-- CreateTable
CREATE TABLE "tb_master_locatype" (
    "id" TEXT NOT NULL,
    "locatype_code" TEXT NOT NULL,
    "locatype_name" TEXT NOT NULL,
    "locatype_desc" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_ip" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_ip" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_master_locatype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_master_location" (
    "id" TEXT NOT NULL,
    "location_code" TEXT NOT NULL,
    "location_name" TEXT NOT NULL,
    "location_address" TEXT,
    "location_locatype" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_ip" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_ip" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_master_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_customer" (
    "id" TEXT NOT NULL,
    "cus_nickname" TEXT NOT NULL,
    "cus_name" TEXT NOT NULL,
    "cus_tel" TEXT,
    "cus_fax" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_ip" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_ip" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_system_settings" (
    "id" TEXT NOT NULL,
    "company_name" TEXT,
    "company_name_th" TEXT,
    "company_address" TEXT,
    "company_tel" TEXT,
    "company_email" TEXT,
    "company_web" TEXT,
    "tat_license" TEXT,
    "logo_image_path" TEXT,
    "qr_code_path" TEXT,
    "condition_booking" TEXT,
    "condition_hotel" TEXT,
    "condition_tour" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_voucher" (
    "id" TEXT NOT NULL,
    "voucher_no" TEXT NOT NULL,
    "voucher_issue_date" TIMESTAMP(3) NOT NULL,
    "voucher_status" TEXT NOT NULL DEFAULT 'Waiting',
    "voucher_guest_name" TEXT NOT NULL,
    "guest_mobile" TEXT,
    "pax_adult" INTEGER NOT NULL DEFAULT 1,
    "pax_child" INTEGER NOT NULL DEFAULT 0,
    "child_age" TEXT,
    "pax_infant" INTEGER NOT NULL DEFAULT 0,
    "voucher_type" TEXT NOT NULL,
    "voucher_company" TEXT,
    "hotel_id" TEXT,
    "check_in_date" TIMESTAMP(3),
    "check_out_date" TIMESTAMP(3),
    "nights" INTEGER,
    "rooms" INTEGER,
    "room_type" TEXT,
    "attraction_id" TEXT,
    "visit_date" TIMESTAMP(3),
    "person_count" INTEGER,
    "entrance_ticket" TEXT,
    "tour_id" TEXT,
    "pickup_hotel_id" TEXT,
    "pickup_time" TEXT,
    "conf_no" TEXT,
    "payment_by" TEXT,
    "remarks" TEXT,
    "conf_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_ip" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_ip" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tb_voucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_master_locatype_locatype_code_key" ON "tb_master_locatype"("locatype_code");

-- CreateIndex
CREATE UNIQUE INDEX "tb_master_location_location_code_key" ON "tb_master_location"("location_code");

-- CreateIndex
CREATE UNIQUE INDEX "tb_customer_cus_nickname_key" ON "tb_customer"("cus_nickname");

-- CreateIndex
CREATE UNIQUE INDEX "tb_voucher_voucher_no_key" ON "tb_voucher"("voucher_no");

-- AddForeignKey
ALTER TABLE "tb_master_location" ADD CONSTRAINT "tb_master_location_location_locatype_fkey" FOREIGN KEY ("location_locatype") REFERENCES "tb_master_locatype"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_voucher" ADD CONSTRAINT "tb_voucher_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "tb_master_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_voucher" ADD CONSTRAINT "tb_voucher_attraction_id_fkey" FOREIGN KEY ("attraction_id") REFERENCES "tb_master_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_voucher" ADD CONSTRAINT "tb_voucher_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tb_master_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_voucher" ADD CONSTRAINT "tb_voucher_pickup_hotel_id_fkey" FOREIGN KEY ("pickup_hotel_id") REFERENCES "tb_master_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
