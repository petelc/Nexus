using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nexus.API.Infrastructure.Migrations.AppDb
{
    /// <inheritdoc />
    public partial class AddCollectionItemTitle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ItemTitle",
                schema: "dbo",
                table: "CollectionItems",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemTitle",
                schema: "dbo",
                table: "CollectionItems");
        }
    }
}
