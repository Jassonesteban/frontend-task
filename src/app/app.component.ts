import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { HomeComponent } from "./pages/home/home.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CreateTaskComponent } from "./pages/create-task/create-task.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, AuthComponent, HomeComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tasksAPI';
}
