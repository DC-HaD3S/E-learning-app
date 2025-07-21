import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorProfileComponent } from './components/instructor-profile/instructor-profile.component';
import { InstructorEditProfileComponent } from './components/instructor-edit-profile/instructor-edit-profile.component';
import { AuthGuard } from 'src/app/auth/auth.guards';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: { role: 'instructor' },
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: InstructorProfileComponent },
      { path: 'edit', component: InstructorEditProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructorRoutingModule {}