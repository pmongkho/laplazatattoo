using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LaPlazaTattoo.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDescriptionToConsultationRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ConsultationRequests",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "ConsultationRequests");
        }
    }
}
