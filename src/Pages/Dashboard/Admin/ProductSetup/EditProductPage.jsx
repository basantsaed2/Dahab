import React, { useEffect, useRef, useState } from 'react'
import { useGet } from '../../../../Hooks/useGet';
import { DropDown, LoaderLogin, NumberInput, StaticButton, SubmitButton, Switch, TextInput, TimeInput, TitlePage, UploadInput } from '../../../../Components/Components';
import { usePost } from '../../../../Hooks/usePostJson';
import { MultiSelect } from 'primereact/multiselect';
import ButtonAdd from '../../../../Components/Buttons/AddButton';
import { useAuth } from '../../../../Context/Auth';
import { replace, useNavigate, useParams } from 'react-router-dom';

const EditProductPage = () => {
       const { productId } = useParams()
       const navigate = useNavigate();
       const auth = useAuth();
       
       /* API Config */
       const apiUrl = import.meta.env.VITE_API_BASE_URL;
       const { refetch: refetchProductEdit, loading: loadingProductEdit, data: dataProductEdit } = useGet({ url: `${apiUrl}/admin/product/item/${productId}` });
       const { refetch: refetchTranslation, loading: loadingTranslation, data: dataTranslation } = useGet({ url: `${apiUrl}/admin/translation` });
       const { refetch: refetchCategory, loading: loadingCategory, data: dataCategory } = useGet({ url: `${apiUrl}/admin/category` });
       const { refetch: refetchProduct, loading: loadingProduct, data: dataProduct } = useGet({ url: `${apiUrl}/admin/product` });
       const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/admin/product/update/${productId}` });
     
       /* Refs */
       const variationTypeRef = useRef([]);
       const [openVariationIndex, setOpenVariationIndex] = useState(null);
       const categoryRef = useRef();
       const subCategoryRef = useRef();
       const itemTypeRef = useRef();
       const stockTypeRef = useRef();
       const discountRef = useRef();
       const taxRef = useRef();
       const productImageRef = useRef();
       const extraDropdownRef = useRef([]);
     
       /* States */
       const [taps, setTaps] = useState([])
       const [currentProductNamesTap, setCurrentProductNamesTap] = useState(0);
       const [currentExcludeNamesTap, setCurrentExcludeNamesTap] = useState(0);
       const [currentExtraNamesTap, setCurrentExtraNamesTap] = useState(0);
       const [currentVariationTap, setCurrentVariationTap] = useState(0);
       const [currentVariationOptionTap, setCurrentVariationOptionTap] = useState(0);
       const [openExtraDropdown, setOpenExtraDropdown] = useState(null);
     
       const [categories, setCategories] = useState([])
       const [subCategories, setSubCategories] = useState([])
       const [filterSubCategories, setFilterSubCategories] = useState([])
       const [addons, setAddons] = useState([])
       const [discounts, setDiscounts] = useState([])
       const [taxes, setTaxes] = useState([])
       const [itemTypes, setItemTypes] = useState([{ id: '', name: 'Selected Item Type' }, , { id: 'online', name: 'online' }, { id: 'offline', name: 'offline' }, { id: 'all', name: 'all' }])
       const [stockTypes, setStockTypes] = useState([{ id: '', name: 'Selected Stock Type' }, , { id: 'unlimited', name: 'unlimited' }, { id: 'daily', name: 'daily' }, { id: 'fixed', name: 'fixed' }])
     
       /* Product Data States */
       const [productEdit, setProductEdit] = useState([]);
       const [productNames, setProductNames] = useState([]);
       const [descriptionNames, setDescriptionNames] = useState([]);
       const [productExclude, setProductExclude] = useState([]);
       const [productExtra, setProductExtra] = useState([]);
       const [productVariations, setProductVariations] = useState([]);
       const [selectedCategoryState, setSelectedCategoryState] = useState('Selected Category')
       const [selectedCategoryId, setSelectedCategoryId] = useState('')
       const [selectedSubCategoryState, setSelectedSubCategoryState] = useState('Selected Subcategory')
       const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
       const [selectedDiscountState, setSelectedDiscountState] = useState('Selected Discount')
       const [selectedDiscountId, setSelectedDiscountId] = useState('')
       const [selectedTaxState, setSelectedTaxState] = useState('Selected Tax')
       const [selectedTaxId, setSelectedTaxId] = useState('')
       const [selectedAddonsState, setSelectedAddonsState] = useState('Selected Addons')
       const [selectedAddonsObjects, setSelectedAddonsObjects] = useState([])
       const [selectedAddonsId, setSelectedAddonsId] = useState([])
       const [selectedItemTypeState, setSelectedItemTypeState] = useState('Selected Item Type')
       const [selectedItemTypeName, setSelectedItemTypeName] = useState('')
       const [selectedStockTypeState, setSelectedStockTypeState] = useState('Selected Stock Type')
       const [selectedStockTypeName, setSelectedStockTypeName] = useState('')
       const [productStockNumber, setProductStockNumber] = useState('')
       const [productPrice, setProductPrice] = useState('')
       const [productPoint, setProductPoint] = useState('')
       const [productStatusFrom, setProductStatusFrom] = useState('')
       const [productStatusTo, setProductStatusTo] = useState('')
       const [productStatus, setProductStatus] = useState(0)
       const [productRecommended, setProductRecommended] = useState(0)
       const [productTimeStatus, setProductTimeStatus] = useState(0)
       const [productImage, setProductImage] = useState(null)
       const [productImageName, setProductImageName] = useState('Choose Photo')
     
       /* Dropdown Status */
       const [isOPenProductCategory, setIsOPenProductCategory] = useState(false)
       const [isOPenProductSubCategory, setIsOPenProductSubCategory] = useState(false)
       const [isOPenProductItemType, setIsOPenProductItemType] = useState(false)
       const [isOPenProductStockType, setIsOPenProductStockType] = useState(false)
       const [isOPenProductDiscount, setIsOPenProductDiscount] = useState(false)
       const [isOPenProductTax, setIsOPenProductTax] = useState(false)
     
       /* Effects */
       useEffect(() => {
         refetchProductEdit();
         refetchTranslation();
         refetchCategory();
         refetchProduct();
       }, [refetchProductEdit, refetchTranslation, refetchCategory, refetchProduct]);
     
       useEffect(() => {
         if (dataTranslation) {
           setTaps(dataTranslation?.translation || []);
         }
         if (dataCategory) {
           setCategories([{ id: '', name: 'Select Category' }, ...dataCategory.parent_categories] || [])
           setSubCategories([{ id: '', name: 'Select Subcategory ' }, ...dataCategory?.sub_categories] || [])
           setAddons(dataCategory?.addons || [])
         }
         if (dataProduct) {
           setDiscounts([{ id: '', name: 'Select Discount' }, ...dataProduct?.discounts] || []);
           setTaxes([{ id: '', name: 'Select Tax' }, ...dataProduct?.taxes] || []);
         }
         if (dataProductEdit) {
           setProductEdit(dataProductEdit?.product || []);
         }
       }, [dataTranslation, dataCategory, dataProduct, dataProductEdit]);
     
       useEffect(() => {
        if (productEdit) {
          setProductNames(productEdit?.product_names || []);
          setDescriptionNames(productEdit?.product_descriptions || []);
          setProductExclude(productEdit?.exclude || []);
          
          // Initialize extras with proper indices and pricing
          const formattedExtras = productEdit?.extras?.map((extra, index) => {
            // Find the default price (where option_id is null)
            const defaultPricing = extra.pricing?.find(p => p.option_id == null);
            
            return {
              names: extra.names?.map(name => ({
                extra_name: name.extra_name,
                tranlation_id: name.tranlation_id,
                tranlation_name: name.tranlation_name
              })) || [],
              extra_price: defaultPricing?.price || "",
              extra_index: extra.id // Using the extra id as index
            };
          }) || [];
          setProductExtra(formattedExtras);
          
          // Initialize variations with proper extra indices
          const formattedVariations = productEdit?.variation?.map(variation => {
            // Map through options to include extras with option-specific pricing
            const optionsWithExtras = variation.options?.map(option => {
              // Find all extras that have pricing for this option
              const optionExtras = productEdit.extras?.flatMap(extra => {
                const optionPricing = extra.pricing?.find(p => p.option_id === option.id);
                if (!optionPricing) return [];
                
                return {
                  extra_index: extra.id,
                  extra_price: optionPricing.price,
                  extra_names: extra.names?.map(name => ({
                    extra_name: name.extra_name,
                    tranlation_id: name.tranlation_id,
                    tranlation_name: name.tranlation_name
                  })) || []
                };
              }) || [];
              
              return {
                id: option.id,
                names: option.names?.map(name => ({
                  name: name.name,
                  tranlation_id: name.tranlation_id,
                  tranlation_name: name.tranlation_name
                })) || [],
                extra: optionExtras,
                points: option.points || "",
                price: option.price || "",
                status: option.status || 0
              };
            }) || [];
            
            return {
              id: variation.id,
              type: variation.type || "single",
              required: variation.required || 0,
              min: variation.min || "",
              max: variation.max || "",
              names: variation.names?.map(name => ({
                name: name.name,
                tranlation_id: name.tranlation_id,
                tranlation_name: name.tranlation_name
              })) || [],
              options: optionsWithExtras
            };
          }) || [];
          setProductVariations(formattedVariations);
      
          // Initialize other product data
          setSelectedAddonsId(productEdit?.addons || []);
          setSelectedCategoryId(productEdit?.category?.id || '');
          setSelectedCategoryState(productEdit?.category?.name || selectedCategoryState);
          setSelectedSubCategoryId(productEdit?.sub_category?.id || '');
          setSelectedSubCategoryState(productEdit?.sub_category?.name || selectedSubCategoryState);
          
          const filterSup = subCategories.filter(sup => sup.category_id === productEdit?.category?.id);
          setFilterSubCategories([{ id: '', name: 'Select Subcategory ' }, ...filterSup] || []);
          
          setSelectedItemTypeName(productEdit?.item_type || '');
          setSelectedItemTypeState(productEdit?.item_type || selectedItemTypeState);
          setProductPrice(productEdit?.price || 0);
          setSelectedStockTypeState(productEdit?.stock_type || selectedStockTypeState);
          setSelectedStockTypeName(productEdit?.stock_type || '');
          setProductStockNumber(productEdit?.number || '');
          setProductImage(productEdit?.image_link || '');
          setProductImageName(productEdit?.image_link || '');
          setSelectedDiscountId(productEdit?.discount?.id || '');
          setSelectedDiscountState(productEdit?.discount?.name || selectedDiscountState);
          setSelectedTaxId(productEdit?.tax?.id || '');
          setSelectedTaxState(productEdit?.tax?.name || selectedTaxState);
          setProductPoint(productEdit?.points || 0);
          setProductStatusFrom(productEdit?.from || '');
          setProductStatusTo(productEdit?.to || '');
          setProductStatus(productEdit?.status || 0);
          setProductTimeStatus(productEdit?.product_time_status || 0);
          setProductRecommended(productEdit?.recommended || 0);
      
          console.log('Initialized product data:', {
            extras: formattedExtras,
            variations: formattedVariations,
            productEdit
          });

            // setDescriptionNames(productEdit?.product_descriptions || [])
            console.log('productEdit?.points', productEdit?.points)
            console.log('productPoint', productPoint)
            console.log('productId', productId)
            console.log('dataProductEdit', productEdit)
            console.log('dataProductEdit', productEdit)
            console.log('ProductNames', productNames)
            console.log('DescriptionNames', descriptionNames)
        }
      }, [productEdit, subCategories]);
     
       /* Handlers */
       const handleAddExclude = () => {
         const newExclude = {
           names: taps.map((tap) => ({
             exclude_name: "",
             tranlation_id: tap.id,
             tranlation_name: tap.name
           })),
         };
         setProductExclude((prev) => [...prev, newExclude]);
       };
     
       const handleRemoveExclude = (index) => {
         setProductExclude((prev) => prev.filter((_, idx) => idx !== index));
       };
     
       const handleAddExtra = () => {
         setProductExtra(prev => [
           ...prev,
           {
             names: taps.map(tap => ({
               extra_name: "",
               tranlation_name: tap.name,
               tranlation_id: tap.id
             })),
             extra_price: "",
             extra_index: prev.length
           }
         ]);
       };
     
       const handleRemoveExtra = (index) => {
         setProductExtra((prev) => prev.filter((_, idx) => idx !== index));
       };
     
       const handleAddVariation = () => {
         const newVariation = {
           type: '',
           required: 0,
           min: '',
           max: '',
           names: taps.map(tap => ({
             name: '',
             tranlation_id: tap.id,
             tranlation_name: tap.name,
           })),
           options: [{
             names: taps.map((tap) => ({
               name: '',
               tranlation_id: tap.id,
               tranlation_name: tap.name,
             })),
             extra: [],
             points: '',
             price: '',
             status: 0,
           }],
         };
         setProductVariations((prev) => [...prev, newVariation]);
       };
     
       const handleRemoveVariation = (index) => {
         setProductVariations((prev) => prev.filter((_, idx) => idx !== index));
       };
     
       const handleAddOption = (variationIndex) => {
         const newOption = {
           names: taps.map((tap) => ({
             name: '',
             tranlation_id: tap.id,
             tranlation_name: tap.name,
           })),
           extra: [],
           price: '',
           points: '',
           status: 0,
         };
         setProductVariations((prev) =>
           prev.map((variation, idx) =>
             idx === variationIndex
               ? { ...variation, options: [...variation.options, newOption] }
               : variation
           )
         );
       };
     
       const handleRemoveOption = (variationIndex, optionIndex) => {
         setProductVariations((prev) =>
           prev.map((variation, vIdx) =>
             vIdx === variationIndex
               ? {
                   ...variation,
                   options: variation.options.filter((_, oIdx) => oIdx !== optionIndex),
                 }
               : variation
           )
         );
       };
     
       const handleAddExtraAtOption = (variationIndex, optionIndex) => {
         if (productExtra.length === 0) {
           auth.toastError('Please add extras first');
           return;
         }
         
         setProductVariations(prev =>
           prev.map((variation, vIdx) =>
             vIdx === variationIndex
               ? {
                   ...variation,
                   options: variation.options.map((option, oIdx) =>
                     oIdx === optionIndex
                       ? {
                           ...option,
                           extra: [
                             ...option.extra,
                             {
                               extra_index: productExtra[0].extra_index,
                               extra_price: productExtra[0].extra_price || "",
                               extra_names: productExtra[0].names
                             }
                           ]
                         }
                       : option
                   )
                 }
               : variation
           )
         );
       };
     
       const handleRemoveExtraAtOption = (variationIndex, optionIndex, extraIndex) => {
         setProductVariations((prev) =>
           prev.map((variation, vIdx) =>
             vIdx === variationIndex
               ? {
                   ...variation,
                   options: variation.options.map((option, oIdx) =>
                     oIdx === optionIndex
                       ? {
                           ...option,
                           extra: option.extra.filter((_, eIdx) => eIdx !== extraIndex),
                         }
                       : option
                   ),
                 }
               : variation
           )
         );
       };
     
       const handleOpenExtraDropdown = (variationIndex, optionIndex, extraIndex) => {
         const key = `${variationIndex}-${optionIndex}-${extraIndex}`;
         setOpenExtraDropdown(openExtraDropdown === key ? null : key);
       };
     
       const handleExtraNameChange = (indexMap, language, value) => {
         setProductExtra(prev => 
           prev.map((item, idx) =>
             idx === indexMap
               ? {
                   ...item,
                   names: item.names.map(name =>
                     name.tranlation_name === language
                       ? { ...name, extra_name: value }
                       : name
                   )
                 }
               : item
           )
         );
       };
     
       const handleExtraPriceChange = (indexMap, price) => {
         setProductExtra(prev => 
           prev.map((item, idx) =>
             idx === indexMap
               ? { ...item, extra_price: price }
               : item
           )
         );
       };
     
       const handleExtraPriceOverride = (variationIndex, optionIndex, extraIndex, price) => {
         setProductVariations(prev => 
           prev.map((variation, vIdx) =>
             vIdx === variationIndex
               ? {
                   ...variation,
                   options: variation.options.map((option, oIdx) =>
                     oIdx === optionIndex
                       ? {
                           ...option,
                           extra: option.extra.map((ext, eIdx) =>
                             eIdx === extraIndex
                               ? { ...ext, extra_price: price }
                               : ext
                           )
                         }
                       : option
                   )
                 }
               : variation
           )
         );
       };
     
       /* Form Submission */
       const validateForm = () => {
         // Validate product names
         const validProductNames = productNames.filter(
           (product) => product && product.tranlation_id && product.product_name && product.tranlation_name
         );
         if (validProductNames.length === 0) {
           auth.toastError('Please enter a product name');
           return false;
         }
     
         // Validate extras have indices
         for (const extra of productExtra) {
           if (extra.extra_index === undefined) {
             auth.toastError('Please ensure all extras have valid indices');
             return false;
           }
         }
     
         // Validate variation extras have indices
         for (const variation of productVariations) {
           for (const option of variation.options) {
             for (const extra of option.extra) {
               if (extra.extra_index === undefined) {
                 auth.toastError('Please ensure all variation extras have valid selections');
                 return false;
               }
             }
           }
         }
     
         return true;
       };
     
       const handleproductEdit = (e) => {
         e.preventDefault();
     
         if (!validateForm()) {
           return;
         }
     
         const formData = new FormData();
         formData.append('category_id', selectedCategoryId);
         formData.append('sub_category_id', selectedSubCategoryId);
         formData.append('item_type', selectedItemTypeName);
         formData.append('stock_type', selectedStockTypeName);
         formData.append('number', productStockNumber);
         formData.append('price', productPrice);
         formData.append('discount_id', selectedDiscountId);
         formData.append('tax_id', selectedTaxId);
         formData.append('points', productPoint);
         formData.append('product_time_status', productTimeStatus);
         
         if (productStatusFrom) formData.append('from', productStatusFrom);
         if (productStatusTo) formData.append('to', productStatusTo);
         
         formData.append('recommended', productRecommended);
         formData.append('status', productStatus);
         formData.append('image', productImage);
     
         // Add addons
         if (selectedAddonsId.length > 0) {
           const addonIds = selectedAddonsId.map((addon) => addon.id);
           addonIds.forEach((id, indexID) => {
             formData.append(`addons[${indexID}]`, id);
           });
         }
     
         // Add product names
         productNames.forEach((name, index) => {
           formData.append(`product_names[${index}][product_name]`, name.product_name);
           formData.append(`product_names[${index}][tranlation_id]`, name.tranlation_id);
           formData.append(`product_names[${index}][tranlation_name]`, name.tranlation_name);
         });
     
         // Add descriptions
         descriptionNames.forEach((name, index) => {
           formData.append(`product_descriptions[${index}][product_description]`, name.description_name);
           formData.append(`product_descriptions[${index}][tranlation_name]`, name.tranlation_name);
           formData.append(`product_descriptions[${index}][tranlation_id]`, name.tranlation_id);
         });
     
         // Add excludes
         if (Array.isArray(productExclude)) {
           productExclude.forEach((exclude, index) => {
             if (Array.isArray(exclude.names)) {
               exclude.names.forEach((exName, exInd) => {
                 formData.append(`excludes[${index}][names][${exInd}][exclude_name]`, exName.exclude_name);
                 formData.append(`excludes[${index}][names][${exInd}][tranlation_id]`, exName.tranlation_id);
                 formData.append(`excludes[${index}][names][${exInd}][tranlation_name]`, exName.tranlation_name);
               });
             }
           });
         }
     
         // Add extras
         if (Array.isArray(productExtra)) {
           productExtra.forEach((extra, index) => {
             if (Array.isArray(extra.names)) {
               extra.names.forEach((exName, exInd) => {
                 formData.append(`extra[${index}][names][${exInd}][extra_name]`, exName.extra_name);
                 formData.append(`extra[${index}][names][${exInd}][tranlation_id]`, exName.tranlation_id);
                 formData.append(`extra[${index}][names][${exInd}][tranlation_name]`, exName.tranlation_name);
               });
             }
             formData.append(`extra[${index}][extra_price]`, extra.extra_price);
           });
         }
     
         // Add variations
         if (Array.isArray(productVariations)) {
           productVariations.forEach((variation, indexVar) => {
             // Variation names
             if (Array.isArray(variation.names)) {
               variation.names.forEach((name, index) => {
                 formData.append(`variations[${indexVar}][names][${index}][name]`, name.name);
                 formData.append(`variations[${indexVar}][names][${index}][tranlation_name]`, name.tranlation_name);
                 formData.append(`variations[${indexVar}][names][${index}][tranlation_id]`, name.tranlation_id);
               });
             }
     
             // Variation options
             if (Array.isArray(variation.options)) {
               variation.options.forEach((option, indexOption) => {
                 // Option names
                 if (Array.isArray(option.names)) {
                   option.names.forEach((optionNa, indexOpNa) => {
                     formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][name]`, optionNa.name);
                     formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_id]`, optionNa.tranlation_id);
                     formData.append(`variations[${indexVar}][options][${indexOption}][names][${indexOpNa}][tranlation_name]`, optionNa.tranlation_name);
                   });
                 }
     
                 // Option extras
                 if (Array.isArray(option.extra)) {
                   option.extra.forEach((extraOption, indexExtra) => {
                     formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_index]`, 
                       extraOption.extra_index !== undefined ? String(extraOption.extra_index) : '0');
                     formData.append(`variations[${indexVar}][options][${indexOption}][extra][${indexExtra}][extra_price]`, 
                       extraOption.extra_price || '0');
                   });
                 }
     
                 // Other option fields
                 formData.append(`variations[${indexVar}][options][${indexOption}][price]`, option.price || '0');
                 formData.append(`variations[${indexVar}][options][${indexOption}][status]`, option.status);
                 formData.append(`variations[${indexVar}][options][${indexOption}][points]`, option.points || '0');
               });
             }
     
             // Variation fields
             formData.append(`variations[${indexVar}][type]`, variation.type);
             formData.append(`variations[${indexVar}][min]`, variation.min);
             formData.append(`variations[${indexVar}][max]`, variation.max);
             formData.append(`variations[${indexVar}][required]`, variation.required ? 1 : 0);
           });
         }
     
         postData(formData, 'Product Edited Success');
       };
     
       /* Other handlers */
       const handleBack = () => {
         navigate(-1, { replace: true });
       };
     
       const handleReset = () => {
         setCurrentProductNamesTap(0);
         setCurrentExcludeNamesTap(0);
         setCurrentExtraNamesTap(0);
         setCurrentVariationTap(0);
         setCurrentVariationOptionTap(0);
         setProductNames([]);
         setDescriptionNames([]);
         setProductExclude([]);
         setProductExtra([]);
         setProductVariations([]);
         setSelectedCategoryState('Selected Category');
         setSelectedCategoryId('');
         setSelectedSubCategoryState('Selected SubCategory');
         setSelectedSubCategoryId('');
         setSelectedDiscountState('Selected Discount');
         setSelectedDiscountId('');
         setSelectedTaxState('Selected Tax');
         setSelectedTaxId('');
         setSelectedAddonsState('Selected Addons');
         setSelectedAddonsId('');
         setSelectedItemTypeState('Selected Item Type');
         setSelectedItemTypeName('');
         setSelectedStockTypeState('Selected Stock Type');
         setSelectedStockTypeName('');
         setProductStockNumber('');
         setProductPrice('');
         setProductPoint('');
         setProductStatusFrom('');
         setProductStatusTo('');
         setProductStatus(0);
         setProductRecommended(0);
         setProductTimeStatus(0);
         setProductImage(null);
         setProductImageName('Choose Photo');
       };
     
       /* UI Handlers */
       const handleOpenVariationType = (index) => {
         setOpenVariationIndex((prevIndex) => (prevIndex === index ? null : index));
       };
     
       const handleOpenOptionProductVariationType = () => {
         setOpenVariationIndex(null);
       };
     
       const handleCloseAllDropdowns = () => {
         setIsOPenProductCategory(false);
         setIsOPenProductSubCategory(false);
         setIsOPenProductItemType(false);
         setIsOPenProductStockType(false);
         setIsOPenProductDiscount(false);
         setIsOPenProductTax(false);
       };
     
       const handleOpenCategory = () => {
         handleCloseAllDropdowns();
         setIsOPenProductCategory(!isOPenProductCategory);
       };
     
       const handleOpenSubCategory = () => {
         handleCloseAllDropdowns();
         setIsOPenProductSubCategory(!isOPenProductSubCategory);
       };
     
       const handleOpenItemType = () => {
         handleCloseAllDropdowns();
         setIsOPenProductItemType(!isOPenProductItemType);
       };
     
       const handleOpenStockType = () => {
         handleCloseAllDropdowns();
         setIsOPenProductStockType(!isOPenProductStockType);
       };
     
       const handleOpenDiscount = () => {
         handleCloseAllDropdowns();
         setIsOPenProductDiscount(!isOPenProductDiscount);
       };
     
       const handleOpenTax = () => {
         handleCloseAllDropdowns();
         setIsOPenProductTax(!isOPenProductTax);
       };
     
       const handleOpenOptionProductCategory = () => setIsOPenProductCategory(false);
       const handleOpenOptionProductSubCategory = () => setIsOPenProductSubCategory(false);
       const handleOpenOptionProductItemType = () => setIsOPenProductItemType(false);
       const handleOpenOptionProductStockType = () => setIsOPenProductStockType(false);
       const handleOpenOptionProductDiscount = () => setIsOPenProductDiscount(false);
       const handleOpenOptionProductTax = () => setIsOPenProductTax(false);
     
       const handleSelectProductVariationType = (option, variationIndex) => {
         setProductVariations((prev) =>
           prev.map((ele, index) =>
             index === variationIndex
               ? { ...ele, type: option.name, min: '', max: '' }
               : ele
           )
         );
       };
     
       const handleSelectProductCategory = (option) => {
         setSelectedCategoryId(option.id);
         setSelectedCategoryState(option.name);
         const filterSup = subCategories.filter(sup => sup.category_id === option.id);
         setFilterSubCategories([{ id: '', name: 'Selected Subcategory' }, ...filterSup]);
       };
     
       const handleSelectProductSubCategory = (option) => {
         setSelectedSubCategoryId(option.id);
         setSelectedSubCategoryState(option.name);
       };
     
       const handleSelectProductItemType = (option) => {
         setSelectedItemTypeName(option.name);
         setSelectedItemTypeState(option.name);
       };
     
       const handleSelectProductStockType = (option) => {
         setSelectedStockTypeName(option.name);
         setSelectedStockTypeState(option.name);
         setProductStockNumber('');
       };
     
       const handleSelectProductDiscount = (option) => {
         setSelectedDiscountId(option.id);
         setSelectedDiscountState(option.name);
       };
     
       const handleSelectProductTax = (option) => {
         setSelectedTaxId(option.id);
         setSelectedTaxState(option.name);
       };
     
       const handleProductStatus = () => {
         setProductStatus(prev => prev === 0 ? 1 : 0);
       };
     
       const handleProductRecommended = () => {
         setProductRecommended(prev => prev === 0 ? 1 : 0);
       };
     
       const handleProductTimeStatus = () => {
         setProductTimeStatus(prev => {
           const newStatus = prev === 0 ? 1 : 0;
           if (newStatus === 0) {
             setProductStatusFrom('');
             setProductStatusTo('');
           }
           return newStatus;
         });
       };
     
       const handleProductImageClick = (ref) => {
         if (ref.current) {
           ref.current.click();
         }
       };
     
       const handleProductImageChange = (e) => {
         const file = e.target.files[0];
         if (file) {
           setProductImage(file);
           setProductImageName(file.name);
         }
       };
     
       const handleProductNamesTap = (index) => {
         setCurrentProductNamesTap(index);
       };
     
       const handleExcludeNamesTap = (index) => {
         setCurrentExcludeNamesTap(index);
       };
     
       const handleExtraNamesTap = (index) => {
         setCurrentExtraNamesTap(index);
       };
     
       const handleVariationTap = (index) => {
         setCurrentVariationTap(index);
       };
     
       const handleVariationOptionTap = (index) => {
         setCurrentVariationOptionTap(index);
       };
       return (
              <>
                {loadingTranslation || loadingCategory || loadingProduct || loadingPost ? (
                  <>
                    <div className="w-full flex justify-center items-center">
                      <LoaderLogin />
                    </div>
                  </>
                ) : (
          
                  <form onSubmit={handleproductEdit} className='w-full flex flex-col items-center justify-center pb-24 gap-5'>
                    <div className="w-full flex flex-col items-start justify-start gap-5">
          
                      {/* Product Names && Description */}
                      <div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">
          
                        <div className="w-full flex items-center justify-start gap-x-6">
                          {taps.map((tap, index) => (
                            <span
                              key={tap.id}
                              onClick={() => handleProductNamesTap(index)}
                              className={`${currentProductNamesTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'}  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                            >
                              {tap.name}
                            </span>
          
                          ))}
                        </div>
          
                        <div className="w-full">
                          {taps.map((tap, index) => (
                            currentProductNamesTap === index && (
                              <div
                                className="w-full flex sm:flex-col lg:flex-row items-center justify-start gap-4"
                                key={tap.id}
                              >
                                {/* Product Name Input */}
                                <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                  <span className="text-xl font-TextFontRegular text-thirdColor">Product Name {tap.name}:</span>
                                  <TextInput
                                    value={productNames[index]?.product_name} // Access category_name property
                                    onChange={(e) => {
                                      const inputValue = e.target.value; // Ensure this is a string
                                      setProductNames(prev => {
                                        const updatedProductNames = [...prev];
          
                                        // Ensure the array is long enough
                                        if (updatedProductNames.length <= index) {
                                          updatedProductNames.length = index + 1; // Resize array
                                        }
          
                                        // Create or update the object at the current index
                                        updatedProductNames[index] = {
                                          ...updatedProductNames[index], // Retain existing properties if any
                                          'tranlation_id': tap.id, // Use the ID from tap
                                          'product_name': inputValue, // Use the captured string value
                                          'tranlation_name': tap.name || 'Default Name', // Use tap.name for tranlation_name
                                        };
          
                                        return updatedProductNames;
                                      });
                                    }}
                                    placeholder="Product Name"
                                  />
                                </div>
          
                                {/* Product Description Input */}
                                <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                  <span className="text-xl font-TextFontRegular text-thirdColor">Product Description {tap.name}:</span>
                                  <TextInput
                                    value={descriptionNames[index]?.description_name} // Access category_name property
                                    onChange={(e) => {
                                      const inputValue = e.target.value; // Ensure this is a string
                                      setDescriptionNames(prev => {
                                        const updatedDescriptionNames = [...prev];
          
                                        // Ensure the array is long enough
                                        if (updatedDescriptionNames.length <= index) {
                                          updatedDescriptionNames.length = index + 1; // Resize array
                                        }
          
                                        // Create or update the object at the current index
                                        updatedDescriptionNames[index] = {
                                          ...updatedDescriptionNames[index], // Retain existing properties if any
                                          'tranlation_id': tap.id, // Use the ID from tap
                                          'description_name': inputValue, // Use the captured string value
                                          'tranlation_name': tap.name || 'Default Name', // Use tap.name for tranlation_name
                                        };
          
                                        return updatedDescriptionNames;
                                      });
                                    }}
                                    placeholder="Product Description"
                                  />
                                </div>
          
                                {/* Conditional Rendering for First Tab Only */}
                              </div>
                            )
                          ))}
          
          
                        </div>
          
                      </div>
          
                      {/* Product Details */}
          
                      {/* More Details */}
                      <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start  gap-5">
                        {/* Product Category  */}
                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">Category Name:</span>
                          <DropDown
                            ref={categoryRef}
                            handleOpen={handleOpenCategory}
                            stateoption={selectedCategoryState}
                            openMenu={isOPenProductCategory}
                            handleOpenOption={handleOpenOptionProductCategory}
                            options={categories}
                            onSelectOption={handleSelectProductCategory}
                          />
                        </div>
                        {/* Product SubCategory  */}
                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">SubCategory Name:</span>
                          <DropDown
                            ref={subCategoryRef}
                            handleOpen={handleOpenSubCategory}
                            stateoption={selectedSubCategoryState}
                            openMenu={isOPenProductSubCategory}
                            handleOpenOption={handleOpenOptionProductSubCategory}
                            options={filterSubCategories}
                            onSelectOption={handleSelectProductSubCategory}
                          />
                        </div>
                        {/* Product Addons  */}
                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">Addons Names:</span>
                          <MultiSelect
                            value={selectedAddonsId}
                            onChange={(e) => setSelectedAddonsId(e.value)} // Assigns entire selected array
                            options={addons}
                            optionLabel="name"
                            display="chip"
                            placeholder={selectedAddonsState}
                            maxSelectedLabels={3}
                            className="w-full md:w-20rem bg-white shadow"
                          />
                        </div>
                      </div>
          
                      <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start gap-5">
                        {/* Product Item Type  */}
                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">Item Type:</span>
                          <DropDown
                            ref={itemTypeRef}
                            handleOpen={handleOpenItemType}
                            stateoption={selectedItemTypeState}
                            openMenu={isOPenProductItemType}
                            handleOpenOption={handleOpenOptionProductItemType}
                            options={itemTypes}
                            onSelectOption={handleSelectProductItemType}
                          />
                        </div>
                        {/* Product Stock Type  */}
                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">Stock Type:</span>
                          <DropDown
                            ref={stockTypeRef}
                            handleOpen={handleOpenStockType}
                            stateoption={selectedStockTypeState}
                            openMenu={isOPenProductStockType}
                            handleOpenOption={handleOpenOptionProductStockType}
                            options={stockTypes}
                            onSelectOption={handleSelectProductStockType}
                          />
                        </div>
          
                        {selectedStockTypeName === 'daily' || selectedStockTypeName === 'fixed' ? (
                          <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                            <span className="text-xl font-TextFontRegular text-thirdColor">Number:</span>
                            <NumberInput
                              value={productStockNumber}
                              onChange={(e) => setProductStockNumber(e.target.value)}
                              placeholder={'Number'}
                            />
                          </div>
                        ) : ('')}
          
                        {/* Product Price */}
                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">Price:</span>
                          <NumberInput
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            placeholder={'Price'}
                          />
                        </div>
                      </div>
          
                      <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start gap-5">
                        {/* Product Discount  */}
                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">Discount Name:</span>
                          <DropDown
                            ref={discountRef}
                            handleOpen={handleOpenDiscount}
                            stateoption={selectedDiscountState}
                            openMenu={isOPenProductDiscount}
                            handleOpenOption={handleOpenOptionProductDiscount}
                            options={discounts}
                            onSelectOption={handleSelectProductDiscount}
                          />
                        </div>
                        {/* Product Tax  */}
                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">Tax Name:</span>
                          <DropDown
                            ref={taxRef}
                            handleOpen={handleOpenTax}
                            stateoption={selectedTaxState}
                            openMenu={isOPenProductTax}
                            handleOpenOption={handleOpenOptionProductTax}
                            options={taxes}
                            onSelectOption={handleSelectProductTax}
                          />
                        </div>
                        {/* Product Point */}
                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">Point:</span>
                          <NumberInput
                            value={productPoint}
                            onChange={(e) => setProductPoint(e.target.value)}
                            placeholder={'Point'}
                          />
                        </div>
                      </div>
          
                      <div className="w-full flex sm:flex-col lg:flex-row items-start justify-start mt-2 gap-5">
                        {/* Product Image */}
                        {/* <div className="sm:w-full lg:w-[33%]  sm:flex-col lg:flex-row flex sm:items-start lg:items-center justify-start gap-x-3"> */}
                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">Product Image:</span>
                          <UploadInput
                            value={productImageName}
                            uploadFileRef={productImageRef}
                            placeholder="Product Image"
                            handleFileChange={handleProductImageChange}
                            onChange={(e) => setProductImage(e.target.value)}
                            onClick={() => handleProductImageClick(productImageRef)}
                          />
                        </div>
          
                        {productTimeStatus === 1 && (
                          <>
          
                            <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                              <span className="text-xl font-TextFontRegular text-thirdColor">From:</span>
                              <TimeInput
                                value={productStatusFrom ?? ''}
                                onChange={(e) => setProductStatusFrom(e.target.value)}
                              />
                              {/* <input type="time" /> */}
                            </div>
          
                            <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                              <span className="text-xl font-TextFontRegular text-thirdColor">To:</span>
                              <TimeInput
                                value={productStatusTo ?? ''}
                                onChange={(e) => setProductStatusTo(e.target.value)}
                              />
                            </div>
                          </>
                        )}
                      </div>
          
                      <div className="w-full sm:flex-col lg:flex-row flex items-start justify-start gap-4">
          
                        {/* Product Status */}
                        <div className='sm:w-full lg:w-[20%] flex items-center justify-start gap-x-3'>
                          <span className="text-xl font-TextFontRegular text-thirdColor">Status:</span>
                          <Switch handleClick={handleProductStatus} checked={productStatus} />
                        </div>
                        {/* Product Product Recommended */}
                        <div className='sm:w-full lg:w-[40%] flex items-center justify-start gap-x-3'>
                          <span className="text-xl font-TextFontRegular text-thirdColor">Product Recommended:</span>
                          <Switch handleClick={handleProductRecommended} checked={productRecommended} />
                        </div>
                        {/* Product Time Status */}
                        <div className='sm:w-full lg:w-[35%] flex items-center justify-start gap-x-3'>
                          <span className="text-xl font-TextFontRegular text-thirdColor">Product Time Status:</span>
                          <Switch handleClick={handleProductTimeStatus} checked={productTimeStatus} />
                        </div>
          
                      </div>
          
                      {/* Exclude Names */}
                      <div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">
          
                        {productExclude.length !== 0 && (
          
          
                          <div className="w-full flex items-center justify-start gap-x-6">
                            {taps.map((tap, index) => (
                              <span
                                key={tap.id}
                                onClick={() => handleExcludeNamesTap(index)}
                                className={`${currentExcludeNamesTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'}  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                              >
                                {tap.name}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="w-full">
                          {taps.map((tap, index) => (
                            currentExcludeNamesTap === index && (
                              <div className="w-full flex flex-col items-center justify-center gap-4" key={tap.id}>
                                {(productExclude || []).map((ele, indexMap) => (
                                  <div
                                    className="w-full flex items-center justify-start gap-5"
                                    key={`${tap.id}-${indexMap}`}
                                  >
                                    {/* Exclude Name Input */}
                                    <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                      <span className="text-xl font-TextFontRegular text-thirdColor">
                                        Exclude Name {tap.name}:
                                      </span>
                                      <TextInput
                                        value={ele.names.find(name => name.tranlation_name === tap.name)?.exclude_name}
                                        onChange={(e) => {
                                          const updatedValue = e.target.value;
                                          setProductExclude((prevProductExclude) =>
                                            prevProductExclude.map((item, idx) =>
                                              idx === indexMap
                                                ? {
                                                  ...item,
                                                  names: item.names.map((name) =>
                                                    name.tranlation_name === tap.name
                                                      ? { ...name, exclude_name: updatedValue }
                                                      : name
                                                  ),
                                                }
                                                : item
                                            )
                                          );
                                        }}
                                        placeholder="Exclude Name"
                                      />
                                    </div>
          
                                    {/* Remove Button */}
                                    {index === 0 && (
                                      <div className="flex items-end mt-10">
                                        <StaticButton
                                          text="Remove"
                                          handleClick={() => handleRemoveExclude(indexMap)}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {index === 0 && (
                                  <div className={`w-full flex items-center ${productExclude.length === 0 ? 'justify-center' : 'justify-start'}`}>
                                    <ButtonAdd
                                      isWidth={true}
                                      Color="mainColor"
                                      Text={productExclude.length === 0 ? 'Add Exclude' : 'Add More Exclude'}
                                      handleClick={handleAddExclude}
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          ))}
                        </div>
          
                      </div>
          
          {/* Extra Names & Price */}
          <div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">
            {productExtra.length !== 0 && (
              <div className="w-full flex items-center justify-start gap-x-6">
                {taps.map((tap, index) => (
                  <span
                    key={tap.id}
                    onClick={() => handleExtraNamesTap(index)}
                    className={`${currentExtraNamesTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'} pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                  >
                    {tap.name}
                  </span>
                ))}
              </div>
            )}
            <div className="w-full">
              {taps.map((tap, index) => (
                currentExtraNamesTap === index && (
                  <div className="w-full flex flex-col items-center justify-center gap-4" key={tap.id}>
                    {(productExtra || []).map((ele, indexMap) => (
                      <div className="w-full flex items-center justify-start gap-5" key={`${tap.id}-${indexMap}`}>
                        {/* Extra Name Input */}
                        <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">
                            Extra Name {tap.name}:
                          </span>
                          <TextInput
                            value={ele.names.find(name => name.tranlation_name === tap.name)?.extra_name}
                            onChange={(e) => handleExtraNameChange(indexMap, tap.name, e.target.value)}
                            placeholder="Extra Name"
                          />
                        </div>
          
                        {/* Extra Price Input (shown for all languages but only editable in first) */}
                        <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                          <span className="text-xl font-TextFontRegular text-thirdColor">
                            Default Price:
                          </span>
                          {index === 0 ? (
                            <NumberInput
                              value={ele.extra_price}
                              onChange={(e) => handleExtraPriceChange(indexMap, e.target.value)}
                              placeholder="Default Price"
                            />
                          ) : (
                            <NumberInput
                              value={ele.extra_price}
                              readOnly
                              placeholder="Default Price"
                            />
                          )}
                        </div>
          
                        {/* Remove Button (only shown for first language) */}
                        {index === 0 && (
                          <div className="flex items-end mt-10">
                            <StaticButton
                              text="Remove"
                              handleClick={() => handleRemoveExtra(indexMap)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {index === 0 && (
                      <div className={`w-full flex items-center ${productExtra.length === 0 ? 'justify-center' : 'justify-start'}`}>
                        <ButtonAdd
                          isWidth={true}
                          Color="mainColor"
                          Text={productExtra.length === 0 ? 'Add Extra' : 'Add More Extra'}
                          handleClick={handleAddExtra}
                        />
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
          
                      {/* Product Variations */}
                      <div className="w-full pb-4 border-b-4 border-gray-300 flex flex-col items-start justify-start gap-4">
          
                        {productVariations.length !== 0 && (
          
          
                          <div className="w-full flex items-center justify-start gap-x-6">
                            {taps.map((tap, index) => (
                              <span
                                key={tap.id}
                                onClick={() => handleVariationTap(index)}
                                className={`${currentVariationTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'}  pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                              >
                                {tap.name}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="w-full">
                          {taps.map((tap, index) => (
                            currentVariationTap === index && (
                              <div className="w-full flex flex-col items-center justify-center gap-4" key={tap.id}>
                                {(productVariations || []).map((ele, indexVariation) => (
                                  <div
                                    className="w-full border-4 border-mainColor p-3 rounded-2xl  flex sm:flex-col lg:flex-row flex-wrap shadow  items-start justify-start gap-5"
                                    key={`${tap.id}-${indexVariation}`}
                                  >
                                    {/* Variation Name */}
                                    <div className="sm:w-full lg:w-[30%] flex sm:flex-col lg:flex-row items-start justify-start gap-5">
                                      <div className="w-full flex flex-col items-start justify-center gap-y-1">
                                        <span className="text-xl font-TextFontRegular text-thirdColor">
                                          Variation Name {tap.name}:
                                        </span>
                                        <TextInput
                                          value={ele.names.find(name => name.tranlation_name === tap.name)?.name}
                                          onChange={(e) => updateVariationState(setProductVariations, indexVariation, 'names', tap.name, e.target.value)}
                                          placeholder="Variation Name"
                                        />
                                      </div>
                                    </div>
                                    {index === 0 && (
                                      <>
                                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                          <span className="text-xl font-TextFontRegular text-thirdColor">Variation Type:</span>
                                          <DropDown
                                            ref={(el) => (variationTypeRef.current[indexVariation] = el)} // Ensure correct indexing for refs
                                            handleOpen={() => handleOpenVariationType(indexVariation)} // Pass index of current variation
                                            stateoption={ele.type || 'Select Type'}
                                            openMenu={openVariationIndex === indexVariation} // Open only if index matches the open state
                                            handleOpenOption={handleOpenOptionProductVariationType}
                                            options={[{ name: 'single' }, { name: 'multiple' }]}
                                            onSelectOption={(option) => handleSelectProductVariationType(option, indexVariation)}
                                          />
                                        </div>
          
                                        {ele.type === 'multiple' && (
                                          <>
                                            <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                              <span className="text-xl font-TextFontRegular text-thirdColor">Min:</span>
                                              <NumberInput
                                                value={ele.min}  // Ensure `ele.points` has a default if undefined
                                                onChange={(e) => {
                                                  const updatedValue = e.target.value;
                                                  setProductVariations((prevProductVariations) =>
                                                    prevProductVariations.map((item, idx) =>
                                                      idx === indexVariation
                                                        ? {
                                                          ...item,
                                                          min: updatedValue, // Ensure this sets `points` correctly
                                                        }
                                                        : item
                                                    )
                                                  );
                                                }}
                                                placeholder={'Min'}
                                              />
                                            </div>
          
                                            <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                              <span className="text-xl font-TextFontRegular text-thirdColor">Max:</span>
                                              <NumberInput
                                                value={ele.max}  // Ensure `ele.points` has a default if undefined
                                                onChange={(e) => {
                                                  const updatedValue = e.target.value;
                                                  setProductVariations((prevProductVariations) =>
                                                    prevProductVariations.map((item, idx) =>
                                                      idx === indexVariation
                                                        ? {
                                                          ...item,
                                                          max: updatedValue, // Ensure this sets `points` correctly
                                                        }
                                                        : item
                                                    )
                                                  );
                                                }}
                                                placeholder={'Max'}
                                              />
                                            </div>
                                          </>
                                        )}
          
                                        <div className='w-[32%] flex mt-10 items-center justify-center gap-x-3'>
                                          <span className="text-xl font-TextFontRegular text-thirdColor">Required:</span>
                                          <Switch
                                            handleClick={() => {
                                              setProductVariations((prevProductVariations) =>
                                                prevProductVariations.map((item, idx) =>
                                                  idx === indexVariation
                                                    ? {
                                                      ...item,
                                                      required: item.required === 1 ? 0 : 1,  // Toggle between 1 and 0
                                                    }
                                                    : item
                                                )
                                              );
                                            }}
                                            checked={ele.required === 1}  // Consider it checked if `required` is 1
                                          />
          
                                        </div>
                                        <div className="w-full">
                                          <TitlePage text={'Options Variation'} />
                                        </div>
                                      </>
                                    )}
          
          
                                    {index === 0 && (
                                      <>
                                        {/* Options */}
                                        <div className="w-full flex items-center justify-start gap-x-6">
                                          {/* Tabs for variation options */}
                                          {taps.map((tap, index) => (
                                            <span
                                              key={tap.id}
                                              onClick={() => handleVariationOptionTap(index)}
                                              className={`${currentVariationOptionTap === index ? 'text-mainColor border-b-4 border-mainColor' : 'text-thirdColor'} 
                            pb-1 text-xl font-TextFontMedium transition-colors duration-300 cursor-pointer hover:text-mainColor`}
                                            >
                                              {tap.name}
                                            </span>
                                          ))}
                                        </div>
          
                                        {/* Render each variation's options */}
                                        {taps.map((tapOption, indexOptionTap) => (
                                          currentVariationOptionTap === indexOptionTap && (
                                            <div className="w-full flex flex-col items-start justify-start gap-4" key={tapOption.id}>
                                              <div className="sm:w-full flex flex-wrap items-start justify-start gap-5">
                                                {/* Render options */}
                                                {ele.options.map((option, indexOption) => (
                                                  <div className="sm:w-full flex flex-wrap items-start justify-start gap-5 shadow-md p-5 pt-0 rounded-xl" key={`${indexOption}-${tapOption.id}`}>
                                                    {/* Option Name */}
                                                    <div className="w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                                                      <span className="text-xl font-TextFontRegular text-thirdColor">
                                                        Option Name {tapOption.name}:
                                                      </span>
                                                      <TextInput
                                                        value={
                                                          option.names.find(nameObj => nameObj.tranlation_name === tapOption.name)?.name
                                                        }
                                                        onChange={(e) => {
                                                          const updatedValue = e.target.value;
                                                          setProductVariations((prevVariations) =>
                                                            prevVariations.map((variation, idx) =>
                                                              idx === indexVariation
                                                                ? {
                                                                  ...variation,
                                                                  options: variation.options.map((opt, optIdx) =>
                                                                    optIdx === indexOption
                                                                      ? {
                                                                        ...opt,
                                                                        names: opt.names.map((nameObj) =>
                                                                          nameObj.tranlation_name === tapOption.name
                                                                            ? { ...nameObj, name: updatedValue }
                                                                            : nameObj
                                                                        ),
                                                                      }
                                                                      : opt
                                                                  ),
                                                                }
                                                                : variation
                                                            )
                                                          );
                                                        }}
                                                        placeholder="Option Name"
                                                      />
                                                    </div>
                                                    {indexOptionTap === 0 && (
                                                      <>
                                                        {/* Option Price */}
                                                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                                          <span className="text-xl font-TextFontRegular text-thirdColor">Price:</span>
                                                          <NumberInput
                                                            value={option.price}
                                                            onChange={(e) => {
                                                              const updatedValue = e.target.value;
                                                              setProductVariations((prevProductVariations) =>
                                                                prevProductVariations.map((item, idx) =>
                                                                  idx === indexVariation
                                                                    ? {
                                                                      ...item,
                                                                      options: item.options.map((opt, optIdx) =>
                                                                        optIdx === indexOption
                                                                          ? { ...opt, price: updatedValue }
                                                                          : opt
                                                                      ),
                                                                    }
                                                                    : item
                                                                )
                                                              );
                                                            }}
                                                            placeholder="Price"
                                                          />
                                                        </div>
                                                        <div className="sm:w-full lg:w-[33%] flex flex-col items-start justify-center gap-y-1">
                                                          <span className="text-xl font-TextFontRegular text-thirdColor">Point:</span>
                                                          <NumberInput
                                                            value={option.points}  // Ensure `ele.points` has a default if undefined
                                                            onChange={(e) => {
                                                              const updatedValue = e.target.value;
                                                              setProductVariations((prevProductVariations) =>
                                                                prevProductVariations.map((item, idx) =>
                                                                  idx === indexVariation
                                                                    ? {
                                                                      ...item,
                                                                      options: item.options.map((opt, optIdx) =>
                                                                        optIdx === indexOption
                                                                          ? { ...opt, points: updatedValue }
                                                                          : opt
                                                                      ),
                                                                    }
                                                                    : item
                                                                )
                                                              );
                                                            }}
                                                            placeholder={'Point'}
                                                          />
                                                        </div>
          
                                                        {/* Option Status */}
                                                        <div className="w-[20%] flex items-center justify-start gap-x-3 lg:mt-3">
                                                          <span className="text-xl font-TextFontRegular text-thirdColor">Status:</span>
                                                          <Switch
                                                            handleClick={() =>
                                                              setProductVariations((prevProductVariations) =>
                                                                prevProductVariations.map((item, idx) =>
                                                                  idx === indexVariation
                                                                    ? {
                                                                      ...item,
                                                                      options: item.options.map((opt, optIdx) =>
                                                                        optIdx === indexOption
                                                                          ? { ...opt, status: opt.status ? 0 : 1 }
                                                                          : opt
                                                                      ),
                                                                    }
                                                                    : item
                                                                )
                                                              )
                                                            }
                                                            checked={option.status === 1}
                                                          />
                                                        </div>
          
                                                      </>
                                                    )}
          
          
                                                  {/* Inside the variation options section */}
          {/* Inside variation options */}
          {option.extra.map((extra, extraIndex) => {
            // Only show in first language tab (indexOptionTap === 0)
            if (indexOptionTap !== 0) return null;
          
            const selectedExtra = productExtra.find(ex => ex.extra_index === extra.extra_index);
            const defaultPrice = selectedExtra?.extra_price || '';
          
            return (
              <div className="w-full flex flex-wrap items-start justify-start gap-5" key={`${tapOption.id}-${indexOption}-${extraIndex}`}>
                {/* Extra Selection Dropdown */}
                <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    Select Extra:
                  </span>
                  <DropDown
                    ref={(el) => (extraDropdownRef.current[`${indexVariation}-${indexOption}-${extraIndex}`] = el)}
                    handleOpen={() => handleOpenExtraDropdown(indexVariation, indexOption, extraIndex)}
                    stateoption={selectedExtra ? 
                      selectedExtra.names[0]?.extra_name || `Extra ${extra.extra_index + 1}` : 
                      'Select Extra'}
                    openMenu={openExtraDropdown === `${indexVariation}-${indexOption}-${extraIndex}`}
                    options={productExtra
                      .filter(ex => 
                        // Show if not used in other extras or is the current selection
                        !option.extra.some(e => e.extra_index === ex.extra_index && e !== extra) || 
                        ex.extra_index === extra.extra_index
                      )
                      .map(ex => ({ 
                        name: ex.names.find(n => n.tranlation_name === taps[0].name)?.extra_name || `Extra ${ex.extra_index + 1}`,
                        value: ex.extra_index 
                      }))}
                    onSelectOption={(selected) => {
                      const selectedExtra = productExtra.find(ex => ex.extra_index === selected.value);
                      if (selectedExtra) {
                        setProductVariations(prev => 
                          prev.map((variation, vIdx) =>
                            vIdx === indexVariation
                              ? {
                                  ...variation,
                                  options: variation.options.map((opt, oIdx) =>
                                    oIdx === indexOption
                                      ? {
                                          ...opt,
                                          extra: opt.extra.map((ext, eIdx) =>
                                            eIdx === extraIndex
                                              ? {
                                                  ...ext,
                                                  extra_index: selectedExtra.extra_index,
                                                  extra_price: selectedExtra.extra_price, // Set default price initially
                                                  extra_names: selectedExtra.names
                                                }
                                              : ext
                                          )
                                        }
                                      : opt
                                  )
                                }
                              : variation
                          )
                        );
                      }
                    }}
                  />
                </div>
          
                {/* Override Price Input */}
                <div className="sm:w-full lg:w-[20%] flex flex-col items-start justify-center gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    Override Price:
                  </span>
                  <NumberInput
                    value={extra.extra_price}
                    onChange={(e) => handleExtraPriceOverride(indexVariation, indexOption, extraIndex, e.target.value)}
                    placeholder="Override Price"
                  />
                </div>
          
                {/* Remove Extra Button */}
                <div className="sm:w-full lg:w-[20%] flex items-center justify-center lg:mt-8">
                  <StaticButton
                    text="Remove Extra"
                    handleClick={() => handleRemoveExtraAtOption(indexVariation, indexOption, extraIndex)}
                  />
                </div>
              </div>
            );
          })}
                                                    {/* Add Extra Button */}
                                                    <div className="sm:w-full flex items-center justify-center">
                                                      <ButtonAdd
                                                        isWidth={true}
                                                        Color="mainColor"
                                                        Text="Add Extra"
                                                        handleClick={() => handleAddExtraAtOption(indexVariation, indexOption)}
                                                      />
                                                    </div>
                                                    {ele.options.length > 1 && (
          
                                                      <div className="sm:w-full lg:w-[20%] flex items-center justify-center lg:mt-8">
                                                        <StaticButton
                                                          text="Remove option"
                                                          handleClick={() =>
                                                            handleRemoveOption(indexVariation, indexOption)
                                                          }
                                                        />
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )
                                        ))}
          
          
          
                                        <div className="w-full flex flex-col gap-y-3">
          
                                          <div className='sm:w-full flex items-center justify-center'>
                                            <ButtonAdd
                                              isWidth={true}
                                              Color="mainColor"
                                              Text={'Add Option'}
                                              handleClick={() => handleAddOption(indexVariation)}
                                            />
                                          </div>
          
                                          <div className='sm:w-full flex items-center justify-end'>
                                            <div className='sm:w-full lg:w-auto'>
                                              <StaticButton
                                                text={'Remove Variation'}
                                                handleClick={() => handleRemoveVariation(indexVariation)}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
          
                                  </div>
                                ))}
                                {index === 0 && (
                                  <div className={`w-full flex items-center ${productVariations.length === 0 ? 'justify-center' : 'justify-start'}`}>
                                    <ButtonAdd
                                      isWidth={true}
                                      Color="mainColor"
                                      Text={productVariations.length === 0 ? 'Add Variation' : 'Add More Variation'}
                                      handleClick={handleAddVariation}
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          ))}
                        </div>
          
                      </div>
          
                    </div>
          
          
                    {/* Buttons*/}
                    <div className="w-full flex items-center justify-end gap-x-4">
                      <div>
                        <StaticButton text={'Reset'} handleClick={handleReset} bgColor='bg-transparent' Color='text-mainColor' border={'border-2'} borderColor={'border-mainColor'} rounded='rounded-full' />
                      </div>
                      <div>
                        <SubmitButton
                          text={'Add Product'}
                          rounded='rounded-full'
                          handleClick={handleproductEdit}
                        />
                      </div>
          
                    </div>
          
                  </form>
                )}
              </>
            )
}

export default EditProductPage