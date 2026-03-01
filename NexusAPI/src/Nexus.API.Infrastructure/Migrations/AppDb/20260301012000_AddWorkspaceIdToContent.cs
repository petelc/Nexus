using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nexus.API.Infrastructure.Migrations.AppDb
{
    /// <inheritdoc />
    public partial class AddWorkspaceIdToContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "WorkspaceId",
                schema: "dbo",
                table: "Documents",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "WorkspaceId",
                schema: "dbo",
                table: "Diagrams",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "WorkspaceId",
                schema: "dbo",
                table: "CodeSnippets",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Documents_WorkspaceId",
                schema: "dbo",
                table: "Documents",
                column: "WorkspaceId",
                filter: "[WorkspaceId] IS NOT NULL AND [IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Diagrams_WorkspaceId",
                schema: "dbo",
                table: "Diagrams",
                column: "WorkspaceId",
                filter: "[WorkspaceId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CodeSnippets_WorkspaceId",
                schema: "dbo",
                table: "CodeSnippets",
                column: "WorkspaceId",
                filter: "[WorkspaceId] IS NOT NULL AND [IsDeleted] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Documents_WorkspaceId",
                schema: "dbo",
                table: "Documents");

            migrationBuilder.DropIndex(
                name: "IX_Diagrams_WorkspaceId",
                schema: "dbo",
                table: "Diagrams");

            migrationBuilder.DropIndex(
                name: "IX_CodeSnippets_WorkspaceId",
                schema: "dbo",
                table: "CodeSnippets");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                schema: "dbo",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                schema: "dbo",
                table: "Diagrams");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                schema: "dbo",
                table: "CodeSnippets");
        }
    }
}
