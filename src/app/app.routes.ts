import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { EcommerceComponent } from './dashboard/ecommerce/ecommerce.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { AccountSettingsComponent } from './settings/account-settings/account-settings.component';
import { SettingsComponent } from './settings/settings.component';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { UsersListComponent } from './pages/users-page/users-list/users-list.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { InvoiceDetailsComponent } from './pages/invoices-page/invoice-details/invoice-details.component';
import { InvoicesComponent } from './pages/invoices-page/invoices/invoices.component';
import { InvoicesPageComponent } from './pages/invoices-page/invoices-page.component';
import { EReviewsComponent } from './pages/ecommerce-page/e-reviews/e-reviews.component';
import { EEditCategoryComponent } from './pages/ecommerce-page/e-edit-category/e-edit-category.component';
import { ECreateCategoryComponent } from './pages/ecommerce-page/e-create-category/e-create-category.component';
import { ECategoriesComponent } from './pages/ecommerce-page/e-categories/e-categories.component';
import { ECreateSellerComponent } from './pages/ecommerce-page/e-create-seller/e-create-seller.component';
import { ESellerDetailsComponent } from './pages/ecommerce-page/e-seller-details/e-seller-details.component';
import { ESellersComponent } from './pages/ecommerce-page/e-sellers/e-sellers.component';
import { EOrderDetailsComponent } from './pages/ecommerce-page/e-order-details/e-order-details.component';
import { EEditProductComponent } from './pages/ecommerce-page/e-edit-product/e-edit-product.component';
import { ECreateProductComponent } from './pages/ecommerce-page/e-create-product/e-create-product.component';
import { EProductDetailsComponent } from './pages/ecommerce-page/e-product-details/e-product-details.component';
import { EProductsListComponent } from './pages/ecommerce-page/e-products-list/e-products-list.component';
import { EcommercePageComponent } from './pages/ecommerce-page/ecommerce-page.component';
import {AuthGuard} from "./authentication/auth-guard.service";
import {UserDetailsComponent} from "./pages/users-page/user-details/user-details.component";
import {RecentOrdersComponent} from "./dashboard/ecommerce/recent-orders/recent-orders.component";

export const routes: Routes = [
    {path: '', component: EcommerceComponent, canActivate: [AuthGuard]},
    {
        path: 'ecommerce-page',
        component: EcommercePageComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', component: EProductsListComponent},
            {path: 'product-details/:id', component: EProductDetailsComponent},
            {path: 'create-product', component: ECreateProductComponent},
            {path: 'edit-product/:id', component: EEditProductComponent},
            {path: 'orders', component: RecentOrdersComponent},
            {path: 'order-details/:id', component: EOrderDetailsComponent},
            {path: 'sellers', component: ESellersComponent},
            {path: 'seller-details', component: ESellerDetailsComponent},
            {path: 'create-seller', component: ECreateSellerComponent},
            {path: 'categories', component: ECategoriesComponent},
            {path: 'create-category', component: ECreateCategoryComponent},
            {path: 'edit-category/:id', component: EEditCategoryComponent},
            {path: 'reviews', component: EReviewsComponent}
        ]
    },
    {
        path: 'invoices',
        component: InvoicesPageComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', component: InvoicesComponent},
            {path: 'invoice-details', component: InvoiceDetailsComponent},
        ]
    },
    {
        path: 'users',
        component: UsersPageComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', component: UsersListComponent},
            {path: 'details/:id', component: UserDetailsComponent},
        ]
    },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            {path: '', component: SignInComponent},
            {path: 'sign-up', component: SignUpComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password', component: ResetPasswordComponent},
            {path: 'confirm-email', component: ConfirmEmailComponent},
        ]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', component: AccountSettingsComponent},
            {path: 'change-password', component: ChangePasswordComponent},
        ]
    },
    {path: 'internal-error', component: InternalErrorComponent},
    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];
