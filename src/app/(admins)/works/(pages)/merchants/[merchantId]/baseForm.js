const j = (
  <>
    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>1.</div>
        <div>Merchant Name</div>
      </label>
      <Input
        className="col-span-9"
        {...register("merchantName")}
        placeholder="Enter Merchant Name"
      />
    </div>
    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>2.</div>
        <div>Merchant SEO Name</div>
      </label>
      <Input
        className="col-span-9"
        {...register("merchantSeoName")}
        placeholder="Enter Merchant SEO Name"
      />
    </div>
    <div className="grid grid-cols-12 gap-4 items-start">
      <label className="col-span-3 flex items-center gap-3">
        <div>3.</div>
        <div>Description</div>
      </label>
      <Textarea
        className="col-span-9"
        {...register("description")}
        placeholder="Enter Description"
      />
    </div>
    <div className="grid grid-cols-12 gap-4 items-start">
      <label className="col-span-3 flex items-center gap-3">
        <div>4.</div>
        <div>Translated Description</div>
      </label>
      <Textarea
        className="col-span-9"
        {...register("translatedDescription")}
        placeholder="Enter translated Description"
      />
    </div>
    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>5.</div>
        <div>Type</div>
      </label>
      <Select
        value={watch("type") || ""}
        onValueChange={(val) => {
          setValue("type", val);
        }}
        // {...register("type")}
      >
        <SelectTrigger className="w-1/2 col-span-9">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {formOptions?.merchantType?.map((type) => (
            <SelectItem key={type.id} value={type.name}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="grid grid-cols-12 gap-4 items-start my-3">
      <label className="col-span-3 flex items-center gap-3">
        <div>6.</div>
        <div>Logo</div>
      </label>
      {logoUrl && logoPublicId ? (
        <div className="flex items-center gap-2">
          <div className="aspect-square h-32">
            <CldImage
              width="960"
              height="600"
              src={logoPublicId}
              sizes="100vw"
              alt="Description of my image"
              className="rounded-full aspect-square object-cover w-full h-full"
              priority
            />
          </div>
          <div className="flex flex-col gap-2">
            <div
              onClick={() => handleRemoveImage()}
              className="h-6 w-6 rounded-full flex justify-center items-center bg-red-500 hover:bg-red-700
             cursor-pointer text-white"
            >
              {isLogoDeleting ? (
                <RiLoader2Line className="animate-spin size-4" />
              ) : (
                <ImCross className="size-3" />
              )}
            </div>
            <div
              onClick={() => setShowImageDialog(true)}
              className="h-6 w-6 rounded-full flex justify-center items-center bg-gray-700 hover:bg-gray-800 cursor-pointer text-white"
            >
              <FaExpandArrowsAlt className="w-4 h-4" />
            </div>
          </div>
          <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
            <DialogContent className="max-w-lg p-4 flex flex-col justify-center items-center">
              <DialogHeader>
                <DialogTitle>Logo Preview</DialogTitle>
              </DialogHeader>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Expanded Logo"
                  className="rounded-full aspect-square object-cover"
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset="coupons"
          options={{
            folder: "logos",
            sources: ["local", "url", "camera", "google_drive", "dropbox"],
          }}
          onSuccess={(result) => {
            if (result.event === "success") {
              const { secure_url, public_id } = result.info;

              // console.log("Image URL:", secure_url);
              // console.log("Public ID:", public_id);

              setValue("logoUrl", secure_url);
              setValue("logoPublicId", public_id);
            }
          }}
          onQueuesEnd={(result, { widget }) => {
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div
                onClick={() => open()}
                className="h-32 w-32 rounded-full border border-input bg-input dark:bg-input/30 dark:hover:bg-input/50 flex justify-center items-center text-input cursor-pointer"
              >
                <FaPlus className="text-2xl" />
              </div>
            );
          }}
        </CldUploadWidget>
      )}
    </div>
    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>7.</div>
        <div>Status</div>
      </label>
      <Select
        value={watch("status") || ""}
        onValueChange={(val) => {
          setValue("status", val);
        }}
      >
        <SelectTrigger className="w-1/2 col-span-9">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* 8. Visibility Dropdown */}
    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>8.</div>
        <div>Visibility</div>
      </label>
      <Select
        value={watch("visibility") || ""}
        onValueChange={(val) => {
          setValue("visibility", val);
        }}
        // {...register("visibility")}
      >
        <SelectTrigger className="w-1/2 col-span-9">
          <SelectValue placeholder="Select visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="premium">Premium</SelectItem>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* 9. Geographic Market */}
    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>9.</div>
        <div>Geographic Market</div>
      </label>
      {/* <Select
          value={watch("geographicMarket") || ""}
          onValueChange={(val) => {
            setValue("geographicMarket", val);
          }}
          // {...register("geographicMarket")}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select market" />
          </SelectTrigger>
          <SelectContent>
            {formOptions?.geographicCountry?.map((country) => (
              <SelectItem key={country.id} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      <Popover
        open={isCountrySectionOpen}
        onOpenChange={setIsCountrySectionOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isCountrySectionOpen}
            className="w-1/2 col-span-9"
          >
            {watchedValues["countries"].length > 0
              ? `${watchedValues["countries"].length} country${
                  watchedValues["countries"].length > 1 ? "ies" : ""
                } selected`
              : "Select countries"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search countries..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {formOptions?.geographicCountry?.map((country) => {
                  const selected = watchedValues.countries?.includes(
                    country.id
                  );

                  return (
                    <CommandItem
                      key={country.id}
                      value={country.name}
                      onSelect={() => {
                        const current = watchedValues.countries || [];
                        if (selected) {
                          // agar already selected hai → remove
                          setValue(
                            "countries",
                            current.filter((c) => c !== country.id),
                            { shouldValidate: true, shouldDirty: true }
                          );
                        } else {
                          // agar nahi hai → add
                          setValue("countries", [...current, country.id], {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {country.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>

    {/* 10. Network Dropdown */}
    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>10.</div>
        <div>Network</div>
      </label>
      <Select
        value={watch("networkId") || ""}
        onValueChange={(val) => {
          setValue("networkId", val);
        }}
      >
        <SelectTrigger className="w-1/2 col-span-9">
          <SelectValue placeholder="Select Network" />
        </SelectTrigger>
        <SelectContent>
          {formOptions?.networks?.map((network) => (
            <SelectItem key={network.id} value={network.id}>
              {network.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>11.</div>
          <div>Currency</div>
        </label>
        <Select
          value={watch("currency") || ""}
          onValueChange={(val) => {
            setValue("currency", val);
          }}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {formOptions?.geographicCountry?.map((country) => (
              <SelectItem key={country.id} value={country.currencyCode}>
                {country.currencyCode +
                  (country.currencySymbol
                    ? ` (${country.currencySymbol})`
                    : "")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>13.</div>
        <div>Merchant URL</div>
      </label>
      <Input
        placeholder="https://merchant.example.com"
        className="col-span-9"
        {...register("merchantUrl")}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>14.</div>
        <div>Affiliate URL</div>
      </label>
      <Input
        placeholder="https://affiliate.example.com"
        className="col-span-9"
        {...register("affiliateUrl")}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>15.</div>
        <div>Is Priority</div>
      </label>
      <Checkbox
        className="size-6"
        checked={watch("isPriority")}
        onCheckedChange={() => {
          setValue("isPriority", !watch("isPriority"));
        }}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>16.</div>
        <div>Is Premium</div>
      </label>
      <Checkbox
        className="size-6"
        checked={watch("isPremium")}
        onCheckedChange={() => {
          setValue("isPremium", !watch("isPremium"));
        }}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>17.</div>
        <div>Page Title</div>
      </label>
      <Input
        placeholder="Enter page title"
        className="col-span-9"
        {...register("pageTitle")}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-start">
      <label className="col-span-3 flex items-center gap-3">
        <div>18.</div>
        <div>Meta Description</div>
      </label>
      <Textarea
        placeholder="Short SEO description"
        className="col-span-9"
        {...register("metaDescription")}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-start">
      <label className="col-span-3 flex items-center gap-3">
        <div>19.</div>
        <div>Meta Keywords</div>
      </label>
      <div className="col-span-9 space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Controller
              name={`metaKeywords.${index}`}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={`${index + 1}. KeyWord`} />
              )}
            />
            {index > 0 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
                size="icon"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" onClick={() => append("")}>
          Add Keyword
        </Button>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>20.</div>
        <div>Page Heading</div>
      </label>
      <Input
        placeholder="Enter heading for page"
        className="col-span-9"
        {...register("pageHeading")}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>21.</div>
        <div>How To Text</div>
      </label>
      <HowToText
        value={watch("howToText") || []}
        onSave={(steps) => setValue("howToText", steps)}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>24.</div>
        <div>Network Merchant Id</div>
      </label>
      <Input
        placeholder="Enter Network Id"
        className="col-span-9"
        {...register("networkMerchantId")}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>25.</div>
        <div>Is CPT Available</div>
      </label>
      <Checkbox
        className="size-6"
        checked={watch("isCPTAvailable")}
        onCheckedChange={() => {
          setValue("isCPTAvailable", !watch("isCPTAvailable"));
        }}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>26.</div>
        <div>Android App URL</div>
      </label>
      <Input
        placeholder="Enter Android App URL"
        className="col-span-9"
        {...register("androidAppUrl")}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>27.</div>
        <div>ios App URL</div>
      </label>
      <Input
        placeholder="Enter ios App URL"
        className="col-span-9"
        {...register("iosAppUrl")}
      />
    </div>

    <div className="grid grid-cols-12 gap-4 items-center">
      <label className="col-span-3 flex items-center gap-3">
        <div>28.</div>
        <div>Windows App URL</div>
      </label>
      <Input
        placeholder="Enter Windows App URL"
        className="col-span-9"
        {...register("windowsAppUrl")}
      />
    </div>
  </>
);
