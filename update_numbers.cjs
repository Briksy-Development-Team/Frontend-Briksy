const fs = require('fs');

const files = [
  'src/app/modules/SubscriptionList/PlanModal.tsx',
  'src/app/modules/apps/shared_table/entity-list/components/header/SideFilter.tsx',
  'src/app/pages/billing/AdminBillingPage.tsx',
  'src/app/pages/platform/AddonsPage.tsx',
  'src/app/pages/platform/DynamicIdSettingsPage.tsx',
  'src/app/services/features/coupons/component/CouponModal.tsx',
  'src/app/services/features/coupons/component/CouponValidationModal.tsx',
  'src/app/services/features/orders/component/OrderModal.tsx',
  'src/app/services/features/properties/component/PropertyModal.tsx',
  'src/app/services/features/service/component/ServiceModal.tsx'
];

const ADDON = ` min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}`;

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('e.key === "-"')) {
     content = content.replace(/type="number"/g, `type="number"${ADDON}`);
     content = content.replace(/type=\{'number'\}/g, `type={'number'}${ADDON}`);
     fs.writeFileSync(file, content);
     console.log(`Updated ${file}`);
  }
});
