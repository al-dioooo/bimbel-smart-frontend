import FormSection from "@/components/forms/form-section"
import Label from "@/components/forms/label"

export default function CreateKelas() {
    return (
        <div className="space-y-6">
            <FormSection title="Kelas">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                        <Label htmlFor="image" value="Image" />
                        <InputImage disabled={configuration('site') === 'go'} onChange={(value) => setImage(value)} aspect="square" id="image" name="image" src={data?.image} error={errors.image} alt="https://placehold.co/400x400/F5F5F5/404040?font=source-sans-pro&text=400x400" />
                        <ErrorMessage error={errors.image} />
                    </div>
                    <div className="col-span-2 space-y-4 sm:col-span-1">
                        <div>
                            <Label htmlFor="model" value="Product Model" />
                            <SelectSearchable disabled={configuration('site') === 'go'} filter={(value) => value.long_name} onChange={(value) => setProductModel(value)} selection={productModelSelection} isLoading={isLoadingProductModelSelection} value={productModel} keyValue={(value) => value.id} title={(value) => value.name} description={(value) => value.long_name} placeholder="Select Product Model" error={errors.product_model_id} />
                            <ErrorMessage error={errors.product_model_id} />
                        </div>
                        {!isBundle && (
                            <div>
                                <Label htmlFor="sku" value="SKU" />
                                <div className="flex space-x-2">
                                    <Input disabled={configuration('site') === 'go'} placeholder="000-SKU-123" onChange={(e) => setSku(e.target.value)} value={sku} id="sku" error={errors.sku} />
                                    <BarcodeScanner onScan={(value) => setSku(value)} />
                                </div>
                                <ErrorMessage error={errors.sku} />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="name" value="Name" />
                            <Input disabled={configuration('site') === 'go'} placeholder="Caliburn AK3 - White" onChange={(e) => setName(e.target.value)} value={name} id="name" error={errors.name} />
                            <Description error={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="long_name" value="Long Name" />
                            <Input disabled={configuration('site') === 'go'} placeholder="Uwell Caliburn AK3 - White" onChange={(e) => setLongName(e.target.value)} value={longName} id="long_name" error={errors.long_name} />
                            <Description error={errors.long_name} />
                        </div>
                        <div>
                            <Label htmlFor="description" value="Description" />
                            <Textarea disabled={configuration('site') === 'go'} placeholder="Lorem ipsum dolar amet." onChange={(e) => setDescription(e.target.value)} value={description} id="description" error={errors.description} />
                            <Description error={errors.description} />
                        </div>
                    </div>
                    {configuration('site') === 'hq' && (
                        <div className="col-span-2">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <Checkbox id="is_pre_order" checked={isPreOrder} onChange={() => setIsPreOrder(!isPreOrder)} />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="is_pre_order" className="font-medium text-gray-700">
                                        Pre-order
                                    </label>
                                    <p className="text-gray-500">Check if the product is pre-order.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </FormSection>
        </div>
    )
}